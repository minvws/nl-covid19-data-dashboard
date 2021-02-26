import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { getValuesInTimeframe, TimeframeOption } from '~/utils/timeframe';

export * from './background-rectangle';

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
export function calculateYMax(
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
   * Value cannot be 0, hence the 1 If the value is below signaalwaarde, make
   * sure the signaalwaarde floats in the middle
   */
  return Math.max(overallMaximum, signaalwaarde * 2, 1);
}

export type TrendValue = {
  __date: Date;
  __value: number;
};

const timestampToDate = (d: number) => new Date(d * 1000);

export type TrendData = (TrendValue & TimestampedValue)[][];

export function getTrendData<T extends TimestampedValue>(
  values: T[],
  metricProperties: string[],
  timeframe: TimeframeOption
): TrendData {
  const series = getValuesInTimeframe(values, timeframe);

  const trendData = metricProperties.map(
    (metricProperty) =>
      (getSingleTrendData(series, metricProperty) as unknown) as (TrendValue &
        TimestampedValue)[]
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
          ...x,
          /**
           * Assuming the config picks out a number property. We could make this
           * stricter in the future with NumberProperty but I choose to strip it
           * to minimize type complexity while figuring things out.
           */
          __value: x[metricProperty as keyof TimestampedValue] as number,
          __date: timestampToDate(x.date_unix),
        }))
        // Filter any possible null values
        .filter((x) => isPresent(x.__value))
    );
  }

  if (isDateSpanSeries(values)) {
    return (
      values
        .map((x) => ({
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
            x.date_start_unix + (x.date_end_unix - x.date_start_unix) / 2
          ),
        }))
        // Filter any possible null values
        .filter((x) => isPresent(x.__value))
    );
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}
