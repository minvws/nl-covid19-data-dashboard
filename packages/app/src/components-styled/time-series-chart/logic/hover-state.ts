import { TimestampedValue } from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { bisectLeft } from 'd3-array';
import { ScaleTime } from 'd3-scale';
import { useCallback, useRef, useState } from 'react';
import { TrendValue } from './trends';
import { SeriesConfig } from './series';

export type HoveredPoint = {
  trendValue: TrendValue;
  /**
   * Values index is used to look up the original value from the values prop
   * based on the bisect outcome (a HoveredPoint).
   */
  valuesIndex: number;
  /**
   * The series config index is used to link a point to the seriesConfig to look
   * up things like color and type.
   */
  seriesConfigIndex: number;
  /**
   * Color should be redundant here due to the seriesConfigIndex property
   */
  color: string;
  /**
   * The position of the point on the overlay
   */
  x: number;
  y: number;
};

interface UseHoverStateArgs<T extends TimestampedValue> {
  values: T[];
  trendsList: TrendValue[][];
  seriesConfig: SeriesConfig<T>[];
  getX: (v: TrendValue) => number;
  getY: (v: TrendValue) => number;
  paddingLeft: number;
  xScale: ScaleTime<number, number>;
}

interface HoverState {
  points: HoveredPoint[];
  nearestPoint: HoveredPoint;
}

type Event = React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>;

type HoverHandler = (event: Event, seriesIndex?: number) => void;

type UseHoveStateResponse = [HoverHandler, HoverState | undefined];

export function useHoverState<T extends TimestampedValue>({
  values: __values,
  trendsList,
  seriesConfig,
  getX,
  getY,
  paddingLeft,
  xScale,
}: UseHoverStateArgs<T>): UseHoveStateResponse {
  const [hoverState, setHoverState] = useState<HoverState>();
  const timeoutRef = useRef<any>();

  /**
   * @TODO we only really have to do bisect once on original values object,
   * because all points of all trends are always coming from those values and
   * are thus aligned vertically.
   */
  const bisect = useCallback(
    function (trend: TrendValue[], xPosition: number): [TrendValue, number] {
      if (trend.length === 1) return [trend[0], 0];

      /**
       * @TODO figure this out. If we can do it without padding, we can move
       * this outside the component
       */
      const date = xScale.invert(xPosition - paddingLeft);

      /**
       * Because this chart is using date_unix (in seconds) as the input for
       * xDomain, the xScale.invert() returns a Date object which was created
       * with that time. Therefor getTime() gives us the original time we put
       * in, so we should not divide by 1000 here.
       *
       * Maybe we can find an "invert" which just returns a number to avoid
       * confusion.
       */
      const date_unix = date.getTime();

      const index = bisectLeft(
        trend.map((x) => x.__date_unix),
        date_unix,
        1
      );

      const d0 = trend[index - 1];
      const d1 = trend[index];

      if (!d1) return [d0, 0];

      return [
        date_unix - d0.__date_unix > d1.__date_unix - date_unix ? d1 : d0,
        index,
      ];
    },
    [paddingLeft, xScale]
  );

  const handleHover = useCallback(
    (event: Event, __trendIndex?: number) => {
      if (event.type === 'mouseleave') {
        /**
         * Here a timeout is used on the clear hover state to prevent the
         * tooltip from getting jittery. Individual elements in the chart can
         * send mouseleave events. This logic is maybe best moved to the the
         * tooltip itself. Or maybe it can be simplified without a ref.
         */
        timeoutRef.current = setTimeout(() => {
          setHoverState(undefined);
          timeoutRef.current = undefined;
        }, 200);
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const mousePoint = localPoint(event);

      if (!mousePoint) {
        return;
      }

      // if (isDefined(trendIndex)) {// setHoverState({ points, nearestPoint});}
      //   else {
      /**
       * @TODO flip this around and do bisect on "values" instead of "trends" We
       * can construct the points from the seriesConfig
       */
      const points: HoveredPoint[] = trendsList.map((trend, index) => {
        /**
         * @TODO we only really need to do the bisect once on a single trend
         * because all trend values come from the same original value object
         */
        const [trendValue, valuesIndex] = bisect(trend, mousePoint.x);

        return {
          trendValue,
          valuesIndex,
          seriesConfigIndex: index,
          x: getX(trendValue),
          y: getY(trendValue),
          /**
           * Color is set here so that the MarkerPoints component doesn't have
           * to look it up from the seriesConfig. This responsibility of
           * figuring out visual properties could be moved to the markers
           * themselves, depending on what is practical when we start using
           * different trend types.
           */
          color: seriesConfig[index].color,
        };
      });

      const nearestPoint = [...points].sort(
        (left, right) =>
          distance(left, mousePoint) - distance(right, mousePoint)
      )[0];

      setHoverState({ points, nearestPoint });
    },
    [bisect, trendsList, seriesConfig, getX, getY]
  );

  return [handleHover, hoverState];
}

const distance = (hoveredPoint: HoveredPoint, localPoint: Point) => {
  /**
   * @TODO rewrite this to getX getY
   *
   * can use use vix standard function for distance?
   *
   * we probably only need to look at the Y component, because all trend values
   * come from the same sample, and that sample has been picked with the bisect
   * call.
   */
  const x = localPoint.x - hoveredPoint.x;
  const y = localPoint.y - hoveredPoint.y;
  return Math.sqrt(x * x + y * y);
};
