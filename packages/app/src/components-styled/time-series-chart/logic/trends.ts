import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { getValuesInTimeframe } from '~/components-styled/stacked-chart/logic';
import { getDaysForTimeframe, TimeframeOption } from '~/utils/timeframe';

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis. We need to do this for each of the keys that are used to
 * render lines, so that the axis scales with whatever key contains the highest
 * values.
 */
export function calculateSeriesMaximum(
  values: TrendValue[][],
  signaalwaarde = -Infinity
) {
  const peakValues = values.map((list) =>
    list
      .map((x) => x.__value)
      .filter(isPresent) // omit null values
      .reduce((acc, value) => (value > acc ? value : acc), -Infinity)
  );

  const overallMaximum = Math.max(...peakValues);

  /**
   * Value cannot be 0, hence the 1. If the value is below signaalwaarde, make
   * sure the signaalwaarde floats in the middle
   */
  return Math.max(overallMaximum, signaalwaarde * 2, 1);
}

/**
 * From a list of values, return the ones that are within the timeframe.
 *
 * This is similar to getFilteredValues but here we assume the value is passed
 * in as-is from the data, and we detect what type of timestamp we should filter
 * on.
 */
export function getTimeframeValues(
  values: TimestampedValue[],
  timeframe: TimeframeOption
) {
  const boundary = getTimeframeBoundaryUnix(timeframe);

  if (isDateSeries(values)) {
    return values.filter((x) => x.date_unix >= boundary);
  }

  if (isDateSpanSeries(values)) {
    return values.filter((x) => x.date_start_unix >= boundary);
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}

const oneDayInSeconds = 24 * 60 * 60;

function getTimeframeBoundaryUnix(timeframe: TimeframeOption) {
  if (timeframe === 'all') {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return Date.now() / 1000 - days * oneDayInSeconds;
}

/**
 * TrendValue here uses date_unix (seconds) timstamps just like the data we get as
 * input unlike the LineChart. I think it makes calculations a little simpler
 * and I didn't find a need for Date objects.
 */
export type TrendValue = {
  __date_unix: number;
  __value: number;
};

/**
 * TrendData here doesn't use the union with TimestampedValue as the LineChart
 * because types got simplified in other places.
 */
type TrendData = TrendValue[][];

export function getTrendData<T extends TimestampedValue>(
  values: T[],
  metricProperties: string[],
  timeframe: TimeframeOption
): TrendData {
  const series = getValuesInTimeframe(values, timeframe);

  const trendData = metricProperties.map((metricProperty) =>
    getSingleTrendData(series, metricProperty)
  );

  return trendData;
}

export function getSingleTrendData(
  values: TimestampedValue[],
  metricProperty: string
): TrendValue[] {
  if (values.length === 0) {
    /**
     * It could happen that you are using an old dataset and select last week as
     * a timeframe at which point the values will be empty. This would not
     * happen on production, but for development we can just render nothing.
     */
    return [];
  }

  if (isDateSeries(values)) {
    return (
      values
        .map((x) => ({
          /**
           * This is messy and could be improved.
           */
          __value: x[metricProperty as keyof TimestampedValue] as number | null,
          __date_unix: x.date_unix,
        }))
        // Filter any possible null values
        .filter((x) => isPresent(x.__value)) as TrendValue[]
    );
  }

  if (isDateSpanSeries(values)) {
    return (
      values
        .map((x) => ({
          /**
           * This is messy and could be improved.
           */
          __value: x[metricProperty as keyof TimestampedValue] as number | null,
          __date_unix:
            /**
             * Here we set the date to be in the middle of the timespan, so that
             * the chart can render the points in the middle of each span.
             */
            x.date_start_unix + (x.date_end_unix - x.date_start_unix) / 2,
        }))
        // Filter any possible null values
        .filter((x) => isPresent(x.__value)) as TrendValue[]
    );
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}
