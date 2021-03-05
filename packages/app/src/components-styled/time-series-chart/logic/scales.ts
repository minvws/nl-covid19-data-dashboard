import {
  DateSpanValue,
  DateValue,
  isDateSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { scaleBand, scaleLinear } from '@visx/scale';
import { extent } from 'd3-array';
import { ScaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
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

    /**
     * To calculate the timespan width we need a full series worth of
     * timestamps. This chart assumes that all series have the same length
     * because they all originate from the same T[] values. If a trend is not
     * full-length it should contain null values, but still have all the
     * timestamps.
     */
    // const timespanMarkerData = seriesList[0] as SeriesItem[];

    // const timespanDates = isDateSeries(values)
    //   ? (values as DateValue[]).map((x) => x.date_unix)
    //   : (values as DateSpanValue[]).map(
    //       (x) => x.date_start_unix
    //       // x.date_end_unix,
    //     );

    /**
     * ☝️ weird. Typescript 4.3 doesn't complain below when mapping over the
     * data, but TS 4.2 thinks x is any. So I'm just leaving this cast to
     * SeriesItem until 4.3 comes along as the official version.
     */
    // const dateSpanScale = scaleBand<number>({
    //   range: [0, bounds.width],
    //   // domain: timespanMarkerData.map((x) => x.__date_unix),
    //   domain: timespanDates,
    // });

    // const markerPadding = dateSpanScale.bandwidth() / 2;

    const xScale = scaleLinear({
      domain: [start, end],
      // range: [markerPadding, bounds.width - markerPadding],
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
      : xScale(end) - xScale(start);

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
