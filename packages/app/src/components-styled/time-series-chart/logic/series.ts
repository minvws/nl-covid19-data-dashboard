import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { pick } from 'lodash';
import { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { getValuesInTimeframe, TimeframeOption } from '~/utils/timeframe';

export type SeriesConfig<T extends TimestampedValue> = (
  | LineSeriesDefinition<T>
  | AreaSeriesDefinition<T>
  | RangeSeriesDefinition<T>
)[];

export type LineSeriesDefinition<T extends TimestampedValue> = {
  type: 'line';
  metricProperty: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
};

export type RangeSeriesDefinition<T extends TimestampedValue> = {
  type: 'range';
  metricPropertyLow: keyof T;
  metricPropertyHigh: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'dashed';
  fillOpacity?: number;
};

export type AreaSeriesDefinition<T extends TimestampedValue> = {
  type: 'area';
  metricProperty: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'striped';
  fillOpacity?: number;
  strokeWidth?: number;
};

export function useSeriesList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>
) {
  return useMemo(() => getSeriesList(values, seriesConfig), [
    values,
    seriesConfig,
  ]);
}

export function useValuesInTimeframe<T extends TimestampedValue>(
  values: T[],
  timeframe: TimeframeOption
) {
  return useMemo(() => getValuesInTimeframe(values, timeframe), [
    values,
    timeframe,
  ]);
}

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis. We need to do this for each of the keys that are used to
 * render lines, so that the axis scales with whatever key contains the highest
 * values.
 */
export function calculateSeriesMaximum<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>,
  benchmarkValue = -Infinity
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

  const artificialMax =
    overallMaximum < benchmarkValue ? benchmarkValue * 2 : 0;

  return Math.max(overallMaximum, artificialMax);
}

export type SeriesItem = {
  __date_unix: number;
};
export interface SeriesSingleValue extends SeriesItem {
  __value: number;
}
export interface SeriesDoubleValue extends SeriesItem {
  __value_a: number;
  __value_b: number;
}

export function isSeriesValue(
  value: SeriesSingleValue | SeriesDoubleValue
): value is SeriesSingleValue {
  return isDefined((value as any).__value);
}

/**
 * There are two types of trends. The normal single value trend and a double
 * value type. Probably we can cover all
 * TrendList here doesn't use the union with TimestampedValue as the LineChart
 * because types got simplified in other places.
 */
export type SeriesList = (SeriesSingleValue[] | SeriesDoubleValue[])[];

export function getSeriesList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>
): SeriesList {
  return seriesConfig.map((config) =>
    config.type === 'range'
      ? getRangeSeriesData(
          values,
          config.metricPropertyLow,
          config.metricPropertyHigh
        )
      : getSeriesData(values, config.metricProperty)
  );
}

export function getRangeSeriesData<T extends TimestampedValue>(
  values: T[],
  metricPropertyLow: keyof T,
  metricPropertyHigh: keyof T
): SeriesDoubleValue[] {
  const seriesLow = getSeriesData(values, metricPropertyLow);
  const seriesHigh = getSeriesData(values, metricPropertyHigh);

  return seriesLow.map((x, index) => ({
    __date_unix: x.__date_unix,
    __value_a: x.__value,
    __value_b: seriesHigh[index].__value,
  }));
}

export function getSeriesData<T extends TimestampedValue>(
  values: T[],
  metricProperty: keyof T
): SeriesSingleValue[] {
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
          __date_unix: x.date_unix,
        }))
        // Filter any possible null values
        .filter((x) => isPresent(x.__value)) as SeriesSingleValue[]
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
          __date_unix:
            /**
             * Here we set the date to be in the middle of the timespan, so that
             * the chart can render the points in the middle of each span.
             */
            // @ts-expect-error @TODO figure out why the type guard doesn't work
            x.date_start_unix + (x.date_end_unix - x.date_start_unix) / 2,
        }))
        // Filter any possible null values
        .filter((x) => isPresent(x.__value)) as SeriesSingleValue[]
    );
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}
