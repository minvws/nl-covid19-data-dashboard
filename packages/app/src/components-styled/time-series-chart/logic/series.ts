import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { getValuesInTimeframe, TimeframeOption } from '~/utils/timeframe';

export type SeriesConfig<T extends TimestampedValue> = (
  | LineSeriesDefinition<T>
  | RangeSeriesDefinition<T>
  | AreaSeriesDefinition<T>
  | StackedAreaSeriesDefinition<T>
  | BarSeriesDefinition<T>
  | InvisibleSeriesDefinition<T>
)[];

export type LineSeriesDefinition<T extends TimestampedValue> = {
  type: 'line';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
};

export type AreaSeriesDefinition<T extends TimestampedValue> = {
  type: 'area';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
};

export type BarSeriesDefinition<T extends TimestampedValue> = {
  type: 'bar';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  fillOpacity?: number;
  aboveBenchmarkColor?: string;
  aboveBenchmarkFillOpacity?: number;
};

export type RangeSeriesDefinition<T extends TimestampedValue> = {
  type: 'range';
  metricPropertyLow: keyof T;
  metricPropertyHigh: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  style?: 'solid' | 'dashed';
  fillOpacity?: number;
};

export type StackedAreaSeriesDefinition<T extends TimestampedValue> = {
  type: 'stacked-area';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  style?: 'solid' | 'hatched';
  fillOpacity?: number;
  strokeWidth?: number;
};

/**
 * An invisible series config does not render any trend but the value shows up
 * in the default tooltip in order with the rest of the items. This allows us to
 * place any value from any metric property under or in between the others, with
 * its own label.
 *
 * This can be used for example to show a total count at the bottom, or the
 * percentage counterpart of an absolute value.
 */
export type InvisibleSeriesDefinition<T extends TimestampedValue> = {
  type: 'invisible';
  metricProperty: keyof T;
  label: string;
  /**
   * The properties that only show in the tooltip are usually different from the
   * chart configuration dataOptions, so we use a specific boolean here to
   * indicate the format.
   */
  isPercentage?: boolean;
};

/**
 * There are some places where we want to handle only series that are visually
 * present in the chart. This is a reverse type guard that you can use in a
 * filter and TS will understand what comes after is only the others.
 */
export function isVisible<T extends TimestampedValue>(
  def: SeriesConfig<T>[number]
): def is Exclude<typeof def, InvisibleSeriesDefinition<T>> {
  return def.type !== 'invisible';
}

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
  seriesList: SeriesList,
  seriesConfig: SeriesConfig<T>,
  benchmarkValue = -Infinity
) {
  const values = seriesList
    .filter((_, index) => isVisible(seriesConfig[index]))
    .flatMap((series) =>
      series.flatMap((x: SeriesSingleValue | SeriesDoubleValue) =>
        isSeriesSingleValue(x) ? x.__value : [x.__value_a, x.__value_b]
      )
    )
    .filter(isDefined);

  const overallMaximum = Math.max(...values);

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
  __value?: number;
}
export interface SeriesDoubleValue extends SeriesItem {
  __value_a?: number;
  __value_b?: number;
}

export function isSeriesSingleValue(
  value: SeriesSingleValue | SeriesDoubleValue
): value is SeriesSingleValue {
  return isDefined((value as any).__value);
}

/**
 * There are two types of trends. The normal single value trend and a double
 * value type. Probably we can cover all TrendList here doesn't use the union
 * with TimestampedValue as the LineChart because types got simplified in other
 * places.
 */
export type SeriesList = (SeriesSingleValue[] | SeriesDoubleValue[])[];

export function getSeriesList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>
): SeriesList {
  return seriesConfig
    .filter(isVisible)
    .map((config) =>
      config.type === 'stacked-area'
        ? getStackedAreaSeriesData(
            values,
            config.metricProperty,
            seriesConfig.filter(
              (x) => x.type === 'stacked-area'
            ) as StackedAreaSeriesDefinition<T>[]
          )
        : config.type === 'range'
        ? getRangeSeriesData(
            values,
            config.metricPropertyLow,
            config.metricPropertyHigh
          )
        : getSeriesData(values, config.metricProperty)
    );
}

function getStackedAreaSeriesData<T extends TimestampedValue>(
  values: T[],
  metricProperty: keyof T,
  stackedAreaSeries: StackedAreaSeriesDefinition<T>[]
) {
  /**
   * Stacked area series are rendered from top to bottom. The sum of a Y-value
   * of all series below the current series equals the low value of a current
   * series's Y-value.
   */
  const seriesBelowCurrentSeries = stackedAreaSeries.slice(
    stackedAreaSeries.findIndex((x) => x.metricProperty === metricProperty) + 1
  );

  const seriesHigh = getSeriesData(values, metricProperty);
  const seriesLow = getSeriesData(values, metricProperty);

  seriesLow.forEach((seriesSingleValue, index) => {
    /**
     * The series are rendered from top to bottom. To get the low value of the
     * current series, we will sum up all values of the
     * `seriesBelowCurrentSeries`.
     */

    seriesSingleValue.__value = seriesBelowCurrentSeries
      // for each serie we'll get the value of the current index
      .map((x) => getSeriesData(values, x.metricProperty)[index])
      // and then sum it up
      .reduce((sum, x) => sum + (x.__value ?? 0), 0);
  });

  return seriesLow.map((low, index) => {
    const valueLow = low.__value ?? 0;
    const valueHigh = valueLow + (seriesHigh[index].__value ?? 0);

    return {
      __date_unix: low.__date_unix,
      __value_a: valueLow,
      __value_b: valueHigh,
    };
  });
}

function getRangeSeriesData<T extends TimestampedValue>(
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

function getSeriesData<T extends TimestampedValue>(
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
    return values.map((x) => ({
      /**
       * This is messy and could be improved.
       */
      __value: (x[metricProperty] ?? undefined) as number | undefined,
      // @ts-expect-error @TODO figure out why the type guard doesn't work
      __date_unix: x.date_unix,
    }));
  }

  if (isDateSpanSeries(values)) {
    return values.map((x) => ({
      /**
       * This is messy and could be improved.
       */
      __value: (x[metricProperty] ?? undefined) as number | undefined,
      __date_unix:
        /**
         * Here we set the date to be in the middle of the timespan, so that the
         * chart can render the points in the middle of each span.
         */
        // @ts-expect-error @TODO figure out why the type guard doesn't work
        x.date_start_unix + (x.date_end_unix - x.date_start_unix) / 2,
    }));
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}
