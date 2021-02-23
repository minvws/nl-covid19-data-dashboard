import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { MouseEvent, TouchEvent, useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { ChartScales } from '~/components-styled/line-chart/components';
import { AreaConfig, TrendConfig } from '../components/area-chart-graph';
import { HoverPoint } from '../components/marker';
import { TimestampedTrendValue } from '../logic';
import { BisectFunction } from './use-bisect';

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
  // This is a bit of a hack because to fit the charts neatly against each other,
  // the last value of one area list is added as the first to the next. Which means
  // there are duplicates in the data lists. When determining the hovered point we
  // don't want to include these copies as they're only used to make sure the rendering
  // connects, so we remove the first item from the last trends and area list here.
  // (This is also why we need to create a copy of these lists here.)
  const _trends = useMemo(() => {
    const result = trends.map((x) => ({
      ...x,
      values: x.values.map((x) => ({ ...x })),
    }));

    result[1].values.shift();

    return result;
  }, [trends]);

  const _areas = useMemo(() => {
    const result = areas.map((x) => ({
      ...x,
      values: x.values.map((x) => ({ ...x })),
    }));

    result[1].values.shift();

    return result;
  }, [areas]);

  return useCallback(
    (
      event: TouchEvent<SVGElement> | MouseEvent<SVGElement>,
      scales: ChartScales
    ) => {
      if (!(_trends.length + _areas.length) || event.type === 'mouseleave') {
        toggleHoverElements(true);
        return;
      }

      const { xScale, yScale } = scales;

      const point = localPoint(event);

      if (!point) {
        return;
      }

      const sortByNearestHorizontal = createSortNearestHorizontal<T | K>(point);

      // First gather all the trends and areas that are closest to the current mouse pointer
      // and turn them into hoverpoints
      const trendHoverPoints = _trends
        .map(calculateNearestTrend(bisect, point, xScale))
        .filter(isDefined)
        .map<HoverPoint<T>>(createHoverPoint(xScale, yScale));

      // Sort all of the points with the hoverpoint with its x coord
      // closest to the mouse pointer first
      let nearestTrends = [...trendHoverPoints].sort(sortByNearestHorizontal);
      const nearestTime = nearestTrends[0].data.__date.getTime();

      // Now only grab the trends with the exact same date as the nearest point.
      nearestTrends = nearestTrends.filter(
        (x) => x.data.__date.getTime() === nearestTime
      );

      // Grab the areas that share the same date, dedupe and create hover points
      const nearestAreas = _areas
        .map(calculateNearestByDate(nearestTrends[0].data.__date))
        .flat()
        .filter(isDefined)
        .map<HoverPoint<K>>(createHoverPoint(xScale, yScale));

      const hoverPoints = [
        ...trendHoverPoints.filter(
          (x) => x.data.__date.getTime() === nearestTime
        ),
        ...nearestAreas,
      ];

      toggleHoverElements(false, hoverPoints, nearestTrends[0]);
    },
    [bisect, _trends, _areas, toggleHoverElements]
  );
}

function calculateNearestTrend<T extends TimestampedTrendValue>(
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

type PointInfo = {
  data: TimestampedTrendValue;
  color?: string;
  label?: string;
};

function calculateNearestByDate<T extends TimestampedTrendValue>(date: Date) {
  const time = date.getTime();
  return (config: AreaConfig<T>) => {
    const trendValue = config.values.find((x) => x.__date.getTime() == time);
    return trendValue
      ? config.displays.map<PointInfo>((x) => ({
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

function createSortNearestHorizontal<T extends TimestampedTrendValue>(
  point: Point
) {
  return (left: HoverPoint<T>, right: HoverPoint<T>) => {
    return Math.abs(point.x - left.x) - Math.abs(point.x - right.x);
  };
}
