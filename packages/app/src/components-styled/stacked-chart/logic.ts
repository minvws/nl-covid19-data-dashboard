import { omit, pick } from 'lodash';
import { isDefined } from 'ts-is-present';
import { assert } from '~/utils/assert';
import { getDaysForTimeframe, TimeframeOption } from '~/utils/timeframe';
import { MouseEvent, TouchEvent, useCallback, useState } from 'react';
// export type Value = DailyValue | WeeklyValue;
export type Value = DateValue | DateSpanValue;

// This type limits the allowed property names to those with a number type, so
// its like keyof T, but filtered down to only the appropriate properties.
export type NumberProperty<T extends Value> = {
  [K in keyof T]: T[K] extends number | null ? K : never;
}[keyof T];

export interface DateValue {
  date_unix: number;
}

export type DateSpanValue = {
  date_start_unix: number;
  date_end_unix: number;
};

/**
 * To read an arbitrary value property from the passed in data, we need to cast
 * the type to a dictionary internally, otherwise TS will complain the index
 * signature is missing on the passed in value type T.
 */
export type AnyValue = Record<string, number | null>;
export type AnyFilteredValue = Record<string, number>;

export function isDateValue(value: Value): value is DateValue {
  return (value as DateValue).date_unix !== undefined;
}

export function isDateSpanValue(value: Value): value is DateSpanValue {
  return (
    (value as DateSpanValue).date_start_unix !== undefined &&
    (value as DateSpanValue).date_end_unix !== undefined
  );
}

export function isDateSeries(series: Value[]): series is DateValue[] {
  const firstValue = (series as DateValue[])[0];

  assert(
    isDefined(firstValue),
    'Unable to determine timestamps if time series is empty'
  );

  return firstValue.date_unix !== undefined;
}

export function isDateSpanSeries(series: Value[]): series is DateSpanValue[] {
  const firstValue = (series as DateSpanValue[])[0];

  assert(
    isDefined(firstValue),
    'Unable to determine timestamps if time series is empty'
  );

  return (
    firstValue.date_start_unix !== undefined &&
    firstValue.date_end_unix !== undefined
  );
}

/**
 * A SeriesPoint contains a __value property which has an object with all the
 * different trends in key/value pairs. This function sums all values together
 * for each point and then returns the highest sum for all points.
 */
export function calculateSeriesMaximum(series: SeriesValue[]) {
  function sumTrendPointValue(point: SeriesValue) {
    return Object.values(omit(point, ['__date'])).reduce(
      (sum, v) => sum + v,
      0
    );
  }

  const stackedSumValues = series.map(sumTrendPointValue);

  return Math.max(...stackedSumValues);
}

/**
 * From a list of values, return the ones that are within the timeframe.
 *
 * This is similar to getFilteredValues but here we assume the value is passed
 * in as-is from the data, and we detect what type of timestamp we should filter
 * on.
 */
export function getValuesInTimeframe<T extends Value>(
  values: T[],
  timeframe: TimeframeOption
) {
  const boundary = getTimeframeBoundaryUnix(timeframe);

  if (isDateSeries(values)) {
    return values.filter((x: DateValue) => x.date_unix >= boundary);
  }

  if (isDateSpanSeries(values)) {
    return values.filter((x: DateSpanValue) => x.date_start_unix >= boundary);
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
 * The SeriesValue is a generic container for the chart data. The original data
 * that is passed in gets converted into this object for each position in the
 * time series. The passed in config propertyName keys are used to pick the data
 * that appears here.
 *
 * A special __date property is reserved for whatever timestamp is found in the
 * data. This can be a daily timestamp or date span.
 */
export type SeriesValue = {
  __date: Date;
} & { [key: string]: number };

const timestampToDate = (d: number) => new Date(d * 1000);

/**
 * This function converts the passed in data to the generic SeriesValue container.
 */
export function getSeriesData<T extends Value>(
  metricValues: Value[],
  metricProperties: (keyof T)[]
): SeriesValue[] {
  return metricValues.map(
    (x) =>
      ({
        ...pick(x, metricProperties),
        __date: getDateFromValue(x),
      } as SeriesValue)
  );
}

function getDateFromValue<T extends Value>(value: T) {
  if (isDateValue(value)) {
    return timestampToDate(value.date_unix);
  }

  if (isDateSpanValue(value)) {
    return timestampToDate(value.date_start_unix);
  }

  throw new Error(`Incompatible timestamps are used in value ${value}`);
}

// type HoverEvent = TouchEvent<SVGElement> | MouseEvent<SVGElement>;

// export function useHoverState(onHover: (event: HoverEvent) => void) {
//   const [isHovered, setIsHovered] = useState(false);

//   const handleHover = (event: HoverEvent) => {
//     const isLeave = event.type === 'mouseleave';
//     setIsHovered(!isLeave);
//     onHover(event);
//   };

//   return [isHovered];
// }

/**
 * @TODO There is nothing stacked-chart specific about this hook, so it could be
 * moved to a shared location
 */
export function useTooltip<T>() {
  const [tooltipData, setTooltipData] = useState<T>();
  const [tooltipLeft, setTooltipLeft] = useState<number>();
  const [tooltipTop, setTooltipTop] = useState<number>();

  const showTooltip = useCallback(
    (x: { tooltipData: T; tooltipLeft: number; tooltipTop: number }) => {
      setTooltipData(x.tooltipData);
      setTooltipLeft(x.tooltipLeft);
      setTooltipTop(x.tooltipTop);
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setTooltipData(undefined);
    setTooltipLeft(undefined);
    setTooltipTop(undefined);
  }, []);

  return {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
  };
}
