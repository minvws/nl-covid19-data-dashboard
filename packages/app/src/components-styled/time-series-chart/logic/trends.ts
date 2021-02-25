import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { pick } from 'lodash';
import { isDefined, isPresent } from 'ts-is-present';
import { getValuesInTimeframe } from '~/components-styled/stacked-chart/logic';
import { getDaysForTimeframe, TimeframeOption } from '~/utils/timeframe';
import { SeriesConfig } from './series';

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis. We need to do this for each of the keys that are used to
 * render lines, so that the axis scales with whatever key contains the highest
 * values.
 */
export function calculateSeriesMaximum<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>,
  signaalwaarde = -Infinity
) {
  const metricProperties = seriesConfig.flatMap((x) =>
    x.type === 'range'
      ? [x.metricPropertyLow, x.metricPropertyHigh]
      : x.metricProperty
  );

  const peakValues = values.map((x) => {
    const trendValues = Object.values(pick(x, metricProperties)) as (
      | number
      | null
    )[];
    return Math.max(...trendValues.filter(isPresent));
  });

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
  __date_ms: number;
  __value: number;
};

export type DoubleTrendValue = {
  __date_ms: number;
  __value_a: number;
  __value_b: number;
};

export function isTrendValue(
  value: TrendValue | DoubleTrendValue
): value is TrendValue {
  return isDefined((value as any).__value);
}

/**
 * There are two types of trends. The normal single value trend and a double
 * value type. Probably we can cover all
 * TrendList here doesn't use the union with TimestampedValue as the LineChart
 * because types got simplified in other places.
 */
export type TrendsList = (TrendValue[] | DoubleTrendValue[])[];

export function getTrendsList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>,
  timeframe: TimeframeOption
): TrendsList {
  const series = getValuesInTimeframe(values, timeframe);

  const trendData = seriesConfig.map((config) =>
    config.type === 'range'
      ? getDoubleTrendData(
          series,
          config.metricPropertyLow,
          config.metricPropertyHigh
        )
      : getTrendData(series, config.metricProperty)
  );

  return trendData;
}

export function getDoubleTrendData<T extends TimestampedValue>(
  values: T[],
  metricPropertyA: keyof T,
  metricPropertyB: keyof T
): DoubleTrendValue[] {
  const trendA = getTrendData(values, metricPropertyA);
  const trendB = getTrendData(values, metricPropertyB);

  /**
   * Merge the data from both trends
   */
  return trendA.map((x, index) => ({
    __date_ms: x.__date_ms,
    __value_a: x.__value,
    __value_b: trendB[index].__value,
  }));
}

export function getTrendData<T extends TimestampedValue>(
  values: T[],
  metricProperty: keyof T
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
          __value: (x[metricProperty] as unknown) as number | null,
          // @ts-expect-error @TODO figure out why the type guard doesn't work
          __date_ms: x.date_unix * 1000,
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
          __value: (x[metricProperty] as unknown) as number | null,
          __date_ms:
            /**
             * Here we set the date to be in the middle of the timespan, so that
             * the chart can render the points in the middle of each span.
             */
            // @ts-expect-error @TODO figure out why the type guard doesn't work
            (x.date_start_unix + (x.date_end_unix - x.date_start_unix) / 2) *
            1000,
        }))
        // Filter any possible null values
        .filter((x) => isPresent(x.__value)) as TrendValue[]
    );
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}
