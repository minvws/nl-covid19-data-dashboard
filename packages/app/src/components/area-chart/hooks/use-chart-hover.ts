import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { MouseEvent, TouchEvent, useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { ChartPadding, ChartScales } from '~/components/line-chart/components';
import { AreaConfig, TrendConfig } from '../components/area-chart-graph';
import { HoverPoint } from '../components/marker';
import { bisect, TimestampedTrendValue } from '../logic';

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
  padding: ChartPadding
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
      values: x.values.slice(),
    }));

    result[1].values.shift();

    return result;
  }, [trends]);

  const _areas = useMemo(() => {
    const result = areas.map((x) => ({
      ...x,
      values: x.values.slice(),
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

      const point = localPoint(event);

      if (!point) {
        toggleHoverElements(true);
        return;
      }
      point.x = point.x - padding.left;

      const { xScale, yScale } = scales;
      const sortByNearestHorizontal = createSortNearestHorizontal(point);

      // First gather all the trends and areas that are closest to the current mouse pointer
      // and turn them into hoverpoints.

      const trendHoverPoints = _trends
        .map(bisectTrends<T>(point, xScale))
        .filter(isDefined)
        .map(createHoverPointFactory(xScale, yScale))
        .sort(sortByNearestHorizontal);

      const nearestTime = trendHoverPoints.length
        ? trendHoverPoints[0].data.__date.getTime()
        : undefined;

      if (!isDefined(nearestTime)) {
        toggleHoverElements(true);
        return;
      }

      // Only grab the trends with the exact same date as the nearest point.
      const nearestTrends = trendHoverPoints.filter(
        (x) => x.data.__date.getTime() === nearestTime
      );

      // Grab the areas that share the same date and create hover points
      const nearestAreas = _areas
        .map(getTrendValuesWithNearestDate(nearestTime))
        .flat()
        .map(createHoverPointFactory(xScale, yScale));

      const hoverPoints = [...nearestTrends, ...nearestAreas];

      toggleHoverElements(false, hoverPoints, nearestTrends[0]);
    },
    [_trends, _areas, toggleHoverElements, padding.left]
  );
}

function bisectTrends<T extends TimestampedTrendValue>(
  point: Point,
  xScale: ScaleTime<number, number>
) {
  return (config: TrendConfig<T>) => {
    const trendValue = bisect(config.values, point.x, xScale) as T;
    return trendValue
      ? {
          data: trendValue,
          color: config.color,
          label: config.legendLabel,
        }
      : undefined;
  };
}

type AreaInfo<T extends TimestampedTrendValue> = {
  data: T;
  color?: string;
  label?: string;
};

function getTrendValuesWithNearestDate<T extends TimestampedTrendValue>(
  nearestDate: number
) {
  return (config: AreaConfig<T>) => {
    const trendValue = config.values.find(
      (x) => x.__date.getTime() == nearestDate
    );
    return trendValue
      ? config.displays.map<AreaInfo<T>>((x) => ({
          data: trendValue,
          color: x.color,
          label: x.legendLabel,
        }))
      : [];
  };
}

function createHoverPointFactory<T extends TimestampedTrendValue>(
  xScale: ScaleTime<number, number>,
  yScale: ScaleLinear<number, number>
) {
  return ({
    data,
    color,
    label,
  }: {
    data: T;
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

function createSortNearestHorizontal(point: Point) {
  return (left: HoverPoint<unknown>, right: HoverPoint<unknown>) => {
    return Math.abs(point.x - left.x) - Math.abs(point.x - right.x);
  };
}
