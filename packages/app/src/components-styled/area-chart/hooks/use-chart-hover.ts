import { localPoint } from '@visx/event';
import { MouseEvent, TouchEvent, useCallback } from 'react';
import { isDefined } from 'ts-is-present';
import {
  ChartScales,
  HoverPoint,
} from '~/components-styled/line-chart/components';
import { BisectFunction } from '~/components-styled/line-chart/hooks/use-bisect';
import { TrendValueWithTimestamp } from '~/components-styled/line-chart/logic';
import { calculateDistance } from '~/utils/calculate-distance';
import { TrendConfig } from '../area-chart-graph';

export function useChartHover<T extends TrendValueWithTimestamp>(
  toggleHoverElements: (
    hide: boolean,
    hoverPoints?: HoverPoint<T>[],
    nearestPoint?: HoverPoint<T>
  ) => void,
  trends: TrendConfig<T>[],
  areas: TrendConfig<T>[],
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

      const sortByNearest = (left: HoverPoint<T>, right: HoverPoint<T>) =>
        calculateDistance(left, point) - calculateDistance(right, point);

      const trendHoverPoints = trends
        .map((trendConfig) => {
          const trendValue = bisect(trendConfig.values, point.x, xScale);
          return trendValue
            ? {
                data: trendValue,
                color: trendConfig.color,
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

      const nearest = [...trendHoverPoints].sort(sortByNearest);

      toggleHoverElements(false, trendHoverPoints, nearest[0]);
    },
    [bisect, trends, areas, toggleHoverElements]
  );
}
