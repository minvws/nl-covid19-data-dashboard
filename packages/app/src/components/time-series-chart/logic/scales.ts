import {
  assert,
  DateSpanValue,
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { scaleLinear } from '@visx/scale';
import { ScaleLinear } from 'd3-scale';
import { first, isEmpty, last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Bounds } from './common';
import { SeriesDoubleValue, SeriesItem, SeriesSingleValue } from './series';

export type GetX = (x: SeriesItem) => number;
export type GetY = (x: SeriesSingleValue) => number;
export type GetY0 = (x: SeriesDoubleValue) => number;
export type GetY1 = (x: SeriesDoubleValue) => number;

interface UseScalesResult {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  getX: GetX;
  getY: GetY;
  getY0: GetY0;
  getY1: GetY1;
  dateSpanWidth: number;
}

export function useScales<T extends TimestampedValue>(args: {
  values: T[];
  maximumValue: number;
  bounds: Bounds;
  numTicks: number;
}) {
  const { maximumValue, bounds, numTicks, values } = args;

  return useMemo(() => {
    const [start, end] = getTimeDomain(values, { withPadding: true });

    if (isEmpty(values)) {
      return {
        xScale: scaleLinear({
          domain: [start, end],
          range: [0, bounds.width],
        }),
        yScale: scaleLinear({
          domain: [0, maximumValue],
          range: [bounds.height, 0],
        }),
        getX: (_x: SeriesItem) => 0,
        getY: (_x: SeriesSingleValue) => 0,
        getY0: (_x: SeriesDoubleValue) => 0,
        getY1: (_x: SeriesDoubleValue) => 0,
        dateSpanWidth: 0,
      };
    }

    const xScale = scaleLinear({
      domain: [start, end],
      range: [0, bounds.width],
      round: true, // round the output values so we render on round pixels
    });

    const yScale = scaleLinear({
      domain: [0, maximumValue],
      range: [bounds.height, 0],
      nice: numTicks,
      round: true, // round the output values so we render on round pixels
    });

    const result: UseScalesResult = {
      xScale,
      yScale,
      getX: (x: SeriesItem) => xScale(x.__date_unix),
      getY: (x: SeriesSingleValue) => yScale(x.__value ?? NaN),
      getY0: (x: SeriesDoubleValue) => yScale(x.__value_a ?? NaN),
      getY1: (x: SeriesDoubleValue) => yScale(x.__value_b ?? NaN),
      dateSpanWidth: getDateSpanWidth(values, xScale),
    };

    return result;
  }, [values, maximumValue, bounds, numTicks]);
}

/**
 * Calculate the first and last date to be shown on the x-axis. We are using the
 * raw values input, assuming that if you passing in data that is showing
 * partial series, you'd still want the first and last timestamps in the values
 * array to be shown.
 *
 * Alternatively we could use the data from `seriesList` to see where the first
 * series starts and where the last series ends, and that would remove all
 * "empty" space on both ends of the chart.
 */
export function getTimeDomain<T extends TimestampedValue>(
  values: T[],
  { withPadding }: { withPadding: boolean }
): [start: number, end: number] {
  /**
   * Return a sensible default when no values fall within the selected timeframe
   */
  if (isEmpty(values)) {
    const today = Date.now() / 1000;
    return [today, today + ONE_DAY_IN_SECONDS];
  }

  /**
   * This code is assuming the values array is already sorted in time, so we
   * only need to pick the first and last values.
   */
  if (isDateSeries(values)) {
    const start = first(values)?.date_unix;
    const end = last(values)?.date_unix;
    assert(
      isDefined(start) && isDefined(end),
      `Missing start or end timestamp in [${start}, ${end}]`
    );

    /**
     * In cases where we render daily data, it is probably good to add a bit of
     * time scale "padding" so that the markers and their date span fall nicely
     * within the "stretched" domain on both ends of the graph.
     */
    return withPadding
      ? [start - ONE_DAY_IN_SECONDS / 2, end + ONE_DAY_IN_SECONDS / 2]
      : [start, end];
  }

  if (isDateSpanSeries(values)) {
    const start = first(values)?.date_start_unix;
    const end = last(values)?.date_end_unix;
    assert(
      isDefined(start) && isDefined(end),
      `Missing start or end timestamp in [${start}, ${end}]`
    );
    return [start, end];
  }

  throw new Error(
    `Invalid timestamped values, shaped like: ${JSON.stringify(values[0])}`
  );
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

/**
 * Calculate the width that one value spans on the chart x-axis. This assumes
 * that all values have consistent timestamps, and that date spans all span the
 * same amount of time each.
 *
 * It also assumes that if we use date_unix it always means one day worth of
 * data.
 */
function getDateSpanWidth<T extends TimestampedValue>(
  values: T[],
  xScale: ScaleLinear<number, number>
) {
  if (isDateSeries(values)) {
    return xScale(ONE_DAY_IN_SECONDS) - xScale(0);
  }

  if (isDateSpanSeries(values)) {
    return (
      xScale((values[0] as DateSpanValue).date_end_unix) -
      xScale((values[0] as DateSpanValue).date_start_unix)
    );
  }

  throw new Error(
    `Invalid timestamped values, shaped like: ${JSON.stringify(values[0])}`
  );
}
