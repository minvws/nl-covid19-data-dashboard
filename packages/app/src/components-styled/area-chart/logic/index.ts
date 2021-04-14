import {
  DateSpanValue,
  DateValue,
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { timestampToDate } from '~/components-styled/stacked-chart/logic';
import {
  getDaysForTimeframe,
  TimeframeOption,
  getValuesInTimeframe,
} from '~/utils/timeframe';

// This type limits the allowed property names to those with a number type,
// so its like keyof T, but filtered down to only the appropriate properties.
export type NumberProperty<T extends TimestampedValue> = {
  [K in keyof T]: T[K] extends number | null ? K : never;
}[keyof T];

/**
 * To read an arbitrary value property from the passed in data, we need to cast
 * the type to a dictionary internally, otherwise TS will complain the index
 * signature is missing on the passed in value type T.
 */
export type AnyValue = Record<string, number | null>;
export type AnyFilteredValue = Record<string, number>;

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis. We need to do this for each of the keys that are used to
 * render lines, so that the axis scales with whatever key contains the highest
 * values.
 */
export function calculateYMax(values: TrendValue[], signaalwaarde = -Infinity) {
  const peakValues = values
    .map((x) => x.__value)
    .filter(isPresent) // omit null values
    .reduce((acc, value) => (value > acc ? value : acc), -Infinity);

  /**
   * Value cannot be 0, hence the 1 If the value is below signaalwaarde, make
   * sure the signaalwaarde floats in the middle
   */
  return Math.max(peakValues, signaalwaarde * 2, 1);
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
  timeframe: TimeframeOption,
  today: Date
) {
  const boundary = getTimeframeBoundaryUnix(timeframe, today);

  if (isDateSeries(values)) {
    return values.filter((x) => x.date_unix >= boundary);
  }

  if (isDateSpanSeries(values)) {
    return values.filter((x) => x.date_start_unix >= boundary);
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}

const oneDayInSeconds = 24 * 60 * 60;

function getTimeframeBoundaryUnix(timeframe: TimeframeOption, today: Date) {
  if (timeframe === 'all') {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return today.getTime() / 1000 - days * oneDayInSeconds;
}

export type TrendValue = {
  __date: Date;
  __value: number;
};

export type TimestampedTrendValue = TrendValue & TimestampedValue;

export function getTrendData<T extends TimestampedValue>(
  values: T[],
  metricProperties: (keyof T)[],
  timeframe: TimeframeOption,
  today: Date
): (T & TimestampedTrendValue)[][] {
  const series = getValuesInTimeframe(values, timeframe, today);

  const trendData = metricProperties.map(
    (metricProperty) =>
      (getSingleTrendData(series, metricProperty as string) as unknown) as (T &
        TimestampedTrendValue)[]
  );

  return trendData;
}

export function getSingleTrendData<T extends TimestampedValue>(
  values: T[],
  metricProperty: string
): (T & TimestampedTrendValue)[] {
  if (values.length === 0) {
    /**
     * It could happen that you are using an old dataset and select last week as
     * a timeframe at which point the values will be empty. This would not
     * happen on production, but for development we can just render nothing.
     */
    return [];
  }

  if (isDateSeries(values)) {
    return values
      .map<T & TimestampedTrendValue>(
        (x) =>
          ({
            ...x,
            /**
             * Assuming the config picks out a number property. We could make this
             * stricter in the future with NumberProperty but I choose to strip it
             * to minimize type complexity while figuring things out.
             */
            __value: x[metricProperty as keyof TimestampedValue] as number,
            __date: timestampToDate((x as DateValue).date_unix),
          } as T & TimestampedTrendValue)
      )
      .filter((x) => isPresent(x.__value));
  }

  if (isDateSpanSeries(values)) {
    return values
      .map<T & TimestampedTrendValue>(
        (x) =>
          ({
            ...x,
            /**
             * Assuming the config picks out a number property. We could make this
             * stricter in the future with NumberProperty but I choose to strip it
             * to minimize type complexity while figuring things out.
             */
            __value: x[metricProperty as keyof TimestampedValue] as number,
            __date: timestampToDate(
              /**
               * Here we set the date to be in the middle of the timespan, so that
               * the chart can render the points in the middle of each span.
               */
              (x as DateSpanValue).date_end_unix
            ),
          } as T & TimestampedTrendValue)
      )
      .filter((x) => isPresent(x.__value));
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}
