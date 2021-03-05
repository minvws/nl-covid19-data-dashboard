import {
  DateSpanValue,
  DateValue,
  isDateSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { scaleLinear } from '@visx/scale';
import { extent } from 'd3-array';
import { ScaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { Bounds } from './common';
import {
  SeriesDoubleValue,
  SeriesItem,
  SeriesList,
  SeriesSingleValue,
} from './series';

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
  seriesList: SeriesList;
  maximumValue: number;
  bounds: Bounds;
  numTicks: number;
}) {
  const { seriesList, maximumValue, bounds, numTicks, values } = args;

  return useMemo(() => {
    /**
     * We could calculate the x domain based on the original values too, but in
     * the trends the timestamps are already unified for daily data and date
     * spans like weeks. The week timestamp then falls in the middle of the
     * week.
     */
    // const [start, end] = extent(seriesList.flat().map((x) => x.__date_unix));

    /**
     * @TODO this could be a simple get first/last element function, because we
     * should be able to assume that values are sorted already
     */
    const [start, end] = isDateSeries(values)
      ? (extent((values as DateValue[]).map((x) => x.date_unix)) as [
          number,
          number
        ])
      : (extent(
          (values as DateSpanValue[]).flatMap((x) => [
            x.date_start_unix,
            x.date_end_unix,
          ])
        ) as [number, number]);

    // const xDomain =
    //   isDefined(start) && isDefined(end) ? [start, end] : undefined;

    // const yDomain = [0, maximumValue];

    const xScale = scaleLinear({
      domain: [start, end],
      range: [0, bounds.width],
    });

    const yScale = scaleLinear({
      domain: [0, maximumValue],
      range: [bounds.height, 0],
      nice: numTicks,
    });

    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    const dateSpanWidth = isDateSeries(values)
      ? xScale(start + ONE_DAY_IN_SECONDS) - xScale(start)
      : xScale((values[0] as DateSpanValue).date_end_unix) -
        xScale((values[0] as DateSpanValue).date_start_unix);

    const result: UseScalesResult = {
      xScale,
      yScale,
      getX: (x: SeriesItem) => xScale(x.__date_unix),
      getY: (x: SeriesSingleValue) => yScale(x.__value),
      getY0: (x: SeriesDoubleValue) => yScale(x.__value_a),
      getY1: (x: SeriesDoubleValue) => yScale(x.__value_b),
      dateSpanWidth,
      // dateSpanWidth: dateSpanScale.bandwidth(),
    };

    return result;
  }, [values, seriesList, maximumValue, bounds, numTicks]);
}
