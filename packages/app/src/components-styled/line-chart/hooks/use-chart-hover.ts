import { TimestampedValue } from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { useCallback } from 'react';
import { isDefined } from 'ts-is-present';
import { LineConfig } from '..';
import { ChartScales, HoverPoint } from '../components';
import { TrendValueWithTimestamp } from '../logic';
import { BisectFunction } from './use-bisect';

const calculateDistance = (
  point1: HoverPoint<TimestampedValue>,
  point2: Point
) => {
  const x = point2.x - point1.x;
  const y = point2.y - point1.y;
  return Math.sqrt(x * x + y * y);
};

export function useChartHover<T extends TimestampedValue>(
  toggleHoverElements: (
    hide: boolean,
    hoverPoints?: HoverPoint<T>[],
    nearestPoint?: HoverPoint<T>
  ) => void,
  trendsList: (T & TrendValueWithTimestamp)[][],
  linesConfig: LineConfig<T>[],
  bisect: BisectFunction
) {
  return useCallback(
    (
      event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
      scales: ChartScales
    ) => {
      if (!trendsList.length || event.type === 'mouseleave') {
        toggleHoverElements(true);
        return;
      }

      const { xScale, yScale } = scales;

      const point = localPoint(event);

      if (!point) {
        return;
      }

      const sortByNearest = (left: HoverPoint<T>, right: HoverPoint<T>) =>
        calculateDistance(left, point) - calculateDistance(right, point);

      const hoverPoints = trendsList
        .map((trends, index) => {
          const trendValue = bisect(trends, point.x, xScale);
          return trendValue
            ? {
                data: trendValue,
                color: linesConfig[index].color,
              }
            : undefined;
        })
        .filter(isDefined)
        .map<HoverPoint<T>>(
          ({ data, color }: { data: any; color?: string }) => {
            return {
              data,
              color,
              x: xScale(data.__date) ?? 0,
              y: yScale(data.__value) ?? 0,
            };
          }
        );
      const nearest = hoverPoints.slice().sort(sortByNearest);

      toggleHoverElements(false, hoverPoints, nearest[0]);
    },
    [bisect, trendsList, linesConfig, toggleHoverElements]
  );
}
