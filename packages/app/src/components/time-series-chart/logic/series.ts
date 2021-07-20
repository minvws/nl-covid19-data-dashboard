import {
  getValuesInTimeframe,
  isDateSeries,
  isDateSpanSeries,
  TimeframeOption,
  TimestampedValue,
} from '@corona-dashboard/common';
import { omit } from 'lodash';
import { useMemo } from 'react';
import { hasValueAtKey, isDefined, isPresent } from 'ts-is-present';
import { useCurrentDate } from '~/utils/current-date-context';
import { TimespanAnnotationConfig } from './common';
import { SplitPoint } from './split';

export type SeriesConfig<T extends TimestampedValue> = (
  | LineSeriesDefinition<T>
  | RangeSeriesDefinition<T>
  | AreaSeriesDefinition<T>
  | StackedAreaSeriesDefinition<T>
  | BarSeriesDefinition<T>
  | SplitBarSeriesDefinition<T>
  | InvisibleSeriesDefinition<T>
  | SplitAreaSeriesDefinition<T>
  | GappedLineSeriesDefinition<T>
  | GappedStackedAreaSeriesDefinition<T>
)[];

interface SeriesCommonDefinition {
  label: string;
  /**
   * By default label is used in both the legend and the tooltip. Short label
   * will overrule the label in the tooltip.
   */
  shortLabel?: string;
  /**
   * Non-interactive means the series will not have hover state and does not
   * show up visually as part of the tooltip (only hidden). Sometimes we want to
   * render a series as a backdrop to give context to another interactive
   * series, like in the sewer chart when a location is selected.
   */
  isNonInteractive?: boolean;
}

export interface GappedLineSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'gapped-line';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
  curve?: 'linear' | 'step';
  isNonInteractive?: boolean;
}

export interface LineSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'line';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
  curve?: 'linear' | 'step';
  isNonInteractive?: boolean;
}

export interface AreaSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'area';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  curve?: 'linear' | 'step';
  isNonInteractive?: boolean;
}

export interface BarSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'bar';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  fillOpacity?: number;
  aboveBenchmarkColor?: string;
  aboveBenchmarkFillOpacity?: number;
  isNonInteractive?: boolean;
}

export interface SplitBarSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'split-bar';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  fillOpacity?: number;
  splitPoints: SplitPoint[];
  isNonInteractive?: boolean;
}

export interface RangeSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'range';
  metricPropertyLow: keyof T;
  metricPropertyHigh: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  style?: 'solid' | 'dashed';
  fillOpacity?: number;
  isNonInteractive?: boolean;
}

export interface StackedAreaSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'stacked-area';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  style?: 'solid' | 'hatched';
  fillOpacity?: number;
  strokeWidth?: number;
  isNonInteractive?: boolean;
}

export interface GappedStackedAreaSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'gapped-stacked-area';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  color: string;
  style?: 'solid' | 'hatched';
  fillOpacity?: number;
  strokeWidth?: number;
  isNonInteractive?: boolean;
}

/**
 * Adding the split series definition here even though it might not end up as
 * part of this chart. For starters this makes it easier because then we can
 * reuse the whole hoverstate and tooltip logic from TimeSeriesChart directly in
 * SplitAreaChart.
 *
 * If the amount of changes for the chart are limited we could maybe merge it in
 * completely.
 */
export interface SplitAreaSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'split-area';
  metricProperty: keyof T;
  label: string;
  shortLabel?: string;
  splitPoints: SplitPoint[];
  strokeWidth?: number;
  fillOpacity?: number;
  isNonInteractive?: boolean;
}

/**
 * An invisible series config does not render any trend but the value shows up
 * in the default tooltip in order with the rest of the items. This allows us to
 * place any value from any metric property under or in between the others, with
 * its own label.
 *
 * This can be used for example to show a total count at the bottom, or the
 * percentage counterpart of an absolute value.
 */
export interface InvisibleSeriesDefinition<T extends TimestampedValue>
  extends SeriesCommonDefinition {
  type: 'invisible';
  metricProperty: keyof T;
  label: string;
  /**
   * The properties that only show in the tooltip are usually different from the
   * chart configuration dataOptions, so we use a specific boolean here to
   * indicate the format.
   */
  isPercentage?: boolean;
  isNonInteractive?: boolean;
}

type CutValuesConfig = {
  start: number;
  end: number;
  metricProperties: string[];
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
  seriesConfig: SeriesConfig<T>,
  cutValuesConfig?: CutValuesConfig[]
) {
  return useMemo(
    () => getSeriesList(values, seriesConfig, cutValuesConfig),
    [values, seriesConfig, cutValuesConfig]
  );
}

export function useValuesInTimeframe<T extends TimestampedValue>(
  values: T[],
  timeframe: TimeframeOption
) {
  const today = useCurrentDate();
  return useMemo(
    () => getValuesInTimeframe(values, timeframe, today),
    [values, timeframe, today]
  );
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
  benchmarkValue = -Infinity,
  isPercentage?: boolean
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

  const maximumValue = Math.max(overallMaximum, artificialMax);

  /**
   * When the maximum value is 80% or more for percentages it shows a 0 - 100 scale
   * same goes when a percentage is below 10% it has a 0 - 10 scale.
   */
  if (isPercentage) {
    if (maximumValue >= 80) return 100;
    if (maximumValue <= 10) return 10;
  }

  return maximumValue;
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
export type SingleSeries = SeriesSingleValue[] | SeriesDoubleValue[];
export type SeriesList = SingleSeries[];

function getSeriesList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>,
  cutValuesConfig?: CutValuesConfig[]
): SeriesList {
  return seriesConfig.filter(isVisible).map((config) =>
    config.type === 'stacked-area'
      ? getStackedAreaSeriesData(values, config.metricProperty, seriesConfig)
      : config.type === 'gapped-stacked-area'
      ? getGappedStackedAreaSeriesData(
          values,
          config.metricProperty,
          seriesConfig
        )
      : config.type === 'range'
      ? getRangeSeriesData(
          values,
          config.metricPropertyLow,
          config.metricPropertyHigh
        )
      : /**
         * Cutting values based on annotation is only supported for single line series
         */
        getSeriesData(values, config.metricProperty, cutValuesConfig)
  );
}

function getGappedStackedAreaSeriesData<T extends TimestampedValue>(
  values: T[],
  metricProperty: keyof T,
  seriesConfig: SeriesConfig<T>
) {
  /**
   * Stacked area series are rendered from top to bottom. The sum of a Y-value
   * of all series below the current series equals the low value of a current
   * series's Y-value.
   */
  const stackedAreaDefinitions = seriesConfig.filter(
    hasValueAtKey('type', 'gapped-stacked-area' as const)
  );

  const seriesBelowCurrentSeries = getSeriesBelowCurrentSeries(
    stackedAreaDefinitions,
    metricProperty
  );

  const seriesHigh = getSeriesData(values, metricProperty);
  const seriesLow = getSeriesData(values, metricProperty);

  seriesLow.forEach((seriesSingleValue, index) => {
    if (!isPresent(seriesSingleValue.__value)) {
      return;
    }
    /**
     * The series are rendered from top to bottom. To get the low value of the
     * current series, we will sum up all values of the
     * `seriesBelowCurrentSeries`.
     */
    seriesSingleValue.__value = sumSeriesValues(
      seriesBelowCurrentSeries,
      values,
      index
    );
  });

  return seriesLow.map((low, index) => {
    const valueLow = low.__value;
    const valueHigh = isDefined(valueLow)
      ? valueLow + (seriesHigh[index].__value ?? 0)
      : undefined;

    return {
      __date_unix: low.__date_unix,
      __value_a: valueLow,
      __value_b: valueHigh,
    };
  });
}

function sumSeriesValues<T extends TimestampedValue>(
  seriesBelowCurrentSeries: { metricProperty: keyof T }[],
  values: T[],
  index: number
): number | undefined {
  return (
    seriesBelowCurrentSeries
      // for each serie we'll get the value of the current index
      .map((x) => getSeriesData(values, x.metricProperty)[index])
      // and then sum it up
      .reduce((sum, x) => sum + (x.__value ?? 0), 0)
  );
}

function getStackedAreaSeriesData<T extends TimestampedValue>(
  values: T[],
  metricProperty: keyof T,
  seriesConfig: SeriesConfig<T>
) {
  /**
   * Stacked area series are rendered from top to bottom. The sum of a Y-value
   * of all series below the current series equals the low value of a current
   * series's Y-value.
   */
  const stackedAreaDefinitions = seriesConfig.filter(
    hasValueAtKey('type', 'stacked-area' as const)
  );

  const seriesBelowCurrentSeries = getSeriesBelowCurrentSeries(
    stackedAreaDefinitions,
    metricProperty
  );

  const seriesHigh = getSeriesData(values, metricProperty);
  const seriesLow = getSeriesData(values, metricProperty);

  seriesLow.forEach((seriesSingleValue, index) => {
    /**
     * The series are rendered from top to bottom. To get the low value of the
     * current series, we will sum up all values of the
     * `seriesBelowCurrentSeries`.
     */
    seriesSingleValue.__value = sumSeriesValues(
      seriesBelowCurrentSeries,
      values,
      index
    );
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

function getSeriesBelowCurrentSeries<T extends TimestampedValue>(
  definitions: { metricProperty: keyof T }[],
  metricProperty: keyof T
) {
  return definitions.slice(
    definitions.findIndex((x) => x.metricProperty === metricProperty) + 1
  );
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
  metricProperty: keyof T,
  cutValuesConfig?: CutValuesConfig[]
): SeriesSingleValue[] {
  if (values.length === 0) {
    /**
     * It could happen that you are using an old dataset and select last week as
     * a timeframe at which point the values will be empty. This would not
     * happen on production, but for development we can just render nothing.
     */
    return [];
  }

  const activeCuts = cutValuesConfig?.filter((x) =>
    x.metricProperties.includes(metricProperty as string)
  );

  if (isDateSeries(values)) {
    const uncutValues = values.map((x) => ({
      /**
       * This is messy and could be improved.
       */
      __value: (x[metricProperty] ?? undefined) as number | undefined,
      // @ts-expect-error @TODO figure out why the type guard doesn't work
      __date_unix: x.date_unix,
    }));

    return activeCuts ? cutValues(uncutValues, activeCuts) : uncutValues;
  }

  if (isDateSpanSeries(values)) {
    const uncutValues = values.map((x) => ({
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

    return activeCuts ? cutValues(uncutValues, activeCuts) : uncutValues;
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}

/**
 * Cutting values means setting series item.__value to undefined. We still want
 * them to be fully qualified series items.
 */
function cutValues(
  values: SeriesSingleValue[],
  cuts: { start: number; end: number }[]
): SeriesSingleValue[] {
  const result = [...values]; // clone because we will mutate this.

  for (const cut of cuts) {
    /**
     * By passing result as the values, we incrementally mutate the input array
     */
    const [startIndex, endIndex] = getCutIndexStartEnd(
      result,
      cut.start,
      cut.end
    );

    clearValues(result, startIndex, endIndex);
  }

  return result;
}

/**
 * Figure out the position and length of the cut to be applied to the values
 * array, based on start/end timestamps
 */
function getCutIndexStartEnd(
  values: SeriesSingleValue[],
  start: number,
  end: number
) {
  const startIndex = values.findIndex(
    (x) => x.__date_unix >= start && x.__date_unix < end
  );

  if (startIndex === -1) {
    /**
     * If the values do not fall within the range of this cut, there is nothing
     * to cut.
     */
    return [];
  }

  const endIndex = values.findIndex((x) => x.__date_unix >= end);

  if (endIndex === -1) {
    /**
     * If the end is not reached, that means that this cut is extended beyond
     * the last value. In which case the endIndex will be the last index in the
     * values array.
     */
    return [startIndex, values.length - 1];
  } else {
    return [startIndex, endIndex];
  }
}

/**
 * Convert timespanAnnotations to a simplified type used to cut the series data.
 * We could just pass down the full annotations type but that would create a bit
 * of an odd dependency between two mostly independent concepts.
 */
export function extractCutValuesConfig(
  timespanAnnotations?: TimespanAnnotationConfig[]
) {
  return timespanAnnotations
    ?.map((x) =>
      x.cutValuesForMetricProperties
        ? ({
            metricProperties: x.cutValuesForMetricProperties,
            start: x.start,
            end: x.end,
          } as CutValuesConfig)
        : undefined
    )
    .filter(isDefined);
}

function clearValues(
  values: SeriesSingleValue[],
  startIndex: number,
  endIndex: number
) {
  for (let index = startIndex; index <= endIndex; ++index) {
    const originalValue = values[index];

    values[index] = {
      ...originalValue,
      __value: undefined,
    };
  }
}

export function omitValuePropertiesForAnnotation<T extends TimestampedValue>(
  value: T,
  timespan: TimespanAnnotationConfig
) {
  if (timespan.cutValuesForMetricProperties) {
    return omit(value, timespan.cutValuesForMetricProperties) as T;
  } else {
    return value;
  }
}
