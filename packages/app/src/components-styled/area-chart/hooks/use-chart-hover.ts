import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { MouseEvent, TouchEvent, useCallback } from 'react';
import { isDefined } from 'ts-is-present';
import {
  ChartScales,
  HoverPoint,
} from '~/components-styled/line-chart/components';
import { BisectFunction } from '~/components-styled/line-chart/hooks/use-bisect';
import { TimestampedTrendValue } from '~/components-styled/line-chart/logic';
import { calculateDistance } from '~/utils/calculate-distance';
import { AreaConfig, TrendConfig } from '../area-chart-graph';

function createTrendValue<T extends TimestampedTrendValue>(
  bisect: BisectFunction,
  point: Point,
  xScale: ScaleTime<number, number>
) {
  return (config: TrendConfig<T>) => {
    const trendValue = bisect(config.values, point.x, xScale);
    return trendValue
      ? {
          data: trendValue,
          color: config.color,
          label: config.legendLabel,
        }
      : undefined;
  };
}

function createAreaValue<T extends TimestampedTrendValue>(
  bisect: BisectFunction,
  point: Point,
  xScale: ScaleTime<number, number>
) {
  return (config: AreaConfig<T>) => {
    const trendValue = bisect(config.values, point.x, xScale);
    return trendValue
      ? config.displays.map((x) => ({
          data: trendValue,
          color: x.color,
          label: x.legendLabel,
        }))
      : [];
  };
}

function createHoverPoint<T extends TimestampedTrendValue>(
  xScale: ScaleTime<number, number>,
  yScale: ScaleLinear<number, number>
) {
  return ({
    data,
    color,
    label,
  }: {
    data: any;
    color?: string;
    label?: string;
  }): HoverPoint<T> => ({
    data,
    color,
    label,
    x: xScale(data.__date) ?? 0,
    y: yScale(data.__value) ?? 0,
  });
}

function createSortNearest<T extends TimestampedTrendValue>(point: Point) {
  return (left: HoverPoint<T>, right: HoverPoint<T>) =>
    calculateDistance(left, point) - calculateDistance(right, point);
}

export function useChartHover<
  T extends TimestampedTrendValue,
  K extends TimestampedTrendValue
>(
  toggleHoverElements: (
    hide: boolean,
    hoverPoints?: HoverPoint<T | K>[],
    nearestPoint?: HoverPoint<T | K>
  ) => void,
  trends: TrendConfig<T>[],
  areas: AreaConfig<K>[],
  bisect: BisectFunction
) {
  return useCallback(
    (
      event: TouchEvent<SVGElement> | MouseEvent<SVGElement>,
      scales: ChartScales
    ) => {
      if (!(trends.length + areas.length) || event.type === 'mouseleave') {
        toggleHoverElements(true);
        return;
      }

      const { xScale, yScale } = scales;

      const point = localPoint(event);

      if (!point) {
        return;
      }

      const sortByNearest = createSortNearest<T | K>(point);

      // First gather all the trends and areas that are closest to the current mouse pointer
      const trendHoverPoints = trends
        .map(createTrendValue(bisect, point, xScale))
        .filter(isDefined)
        .map<HoverPoint<T>>(createHoverPoint(xScale, yScale));
      const areaHoverPoints = areas
        .map(createAreaValue(bisect, point, xScale))
        .flat()
        .filter(isDefined)
        .map<HoverPoint<K>>(createHoverPoint(xScale, yScale));

      let nearestAreas = [...areaHoverPoints].sort(sortByNearest);
      let nearestTrends = [...trendHoverPoints].sort(sortByNearest);

      // Filter the datasets that have the exact same date value as the nearest point.
      // (Since we can draw trends that are adjacent to each other)
      nearestTrends = nearestTrends.filter(
        (x) => x.data.__date === nearestTrends[0].data.__date
      );
      nearestAreas = nearestAreas.filter(
        (x) => x.data.__date === nearestAreas[0].data.__date
      );

      // of all the given points, trends and areas, determine which one is closest to the pointer
      const nearest =
        nearestTrends.length && nearestAreas.length
          ? [nearestTrends[0], nearestAreas[0]].sort(sortByNearest)
          : nearestTrends.length
          ? nearestTrends
          : nearestAreas;

      toggleHoverElements(
        false,
        [
          ...trendHoverPoints.filter(
            (x) => x.data.__date === nearestTrends[0].data.__date
          ),
          ...areaHoverPoints.filter(
            (x) => x.data.__date === nearestAreas[0].data.__date
          ),
        ],
        nearest[0]
      );
    },
    [bisect, trends, areas, toggleHoverElements]
  );
}
