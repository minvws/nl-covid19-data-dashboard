import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { bisectLeft } from 'd3-array';
import { ScaleLinear } from 'd3-scale';
import { useCallback, useMemo, useRef, useState } from 'react';
import { isDefined } from 'ts-is-present';
import {
  SeriesConfig,
  RangeSeriesValue,
  SeriesList,
  SeriesValue,
} from './series';

export type HoveredPoint<T> = {
  seriesValue: SeriesValue | RangeSeriesValue;
  metricProperty: keyof T;
  color: string;
  x: number;
  y: number;
};

interface UseHoverStateArgs<T extends TimestampedValue> {
  values: T[];
  seriesList: SeriesList;
  seriesConfig: SeriesConfig<T>;
  paddingLeft: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
}

interface HoverState<T> {
  valuesIndex: number;
  linePoints: HoveredPoint<T>[];
  rangePoints: HoveredPoint<T>[];
  nearestLinePoint: HoveredPoint<T>;
}

type Event = React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>;

type HoverHandler = (event: Event, seriesIndex?: number) => void;

type UseHoveStateResponse<T> = [HoverHandler, HoverState<T> | undefined];

export function useHoverState<T extends TimestampedValue>({
  values,
  seriesList,
  seriesConfig,
  paddingLeft,
  xScale,
  yScale,
}: UseHoverStateArgs<T>): UseHoveStateResponse<T> {
  const [hoverState, setHoverState] = useState<HoverState<T>>();
  const timeoutRef = useRef<any>();

  const valuesDateUnix = useMemo(
    () =>
      values.map((x) =>
        isDateValue(x)
          ? x.date_unix
          : isDateSpanValue(x)
          ? /**
             * @TODO share logic with trend code
             */
            x.date_start_unix + (x.date_end_unix - x.date_start_unix) / 2
          : 0
      ),
    [values]
  );

  /**
   * We only really have to do bisect once on original values object, because
   * all points of all trends are always coming from those values and are thus
   * aligned vertically.
   *
   * In this chart TrendValue __date was replaced with __date_unix, so that we
   * can use the original data timestamps directly for the xDomain without
   * conversion to/from Date objects.
   */
  const bisect = useCallback(
    function (values: TimestampedValue[], xPosition: number): number {
      if (values.length === 1) return 0;

      /**
       * @TODO figure this out. If we can do it without padding, we can move
       * this outside the component
       */
      const date_unix = xScale.invert(xPosition - paddingLeft);

      return bisectLeft(valuesDateUnix, date_unix, 0, values.length - 1);
    },
    [paddingLeft, xScale, valuesDateUnix]
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

      /**
       * Bisect here is working directly on the original values (as opposed to
       * individual trends in LineChart. This should be more efficient since we
       * only need to do it once. It also provides flexibility in constructing
       * hover state elements for different types based on the series config.
       */
      const valuesIndex = bisect(values, mousePoint.x);

      const linePoints: HoveredPoint<T>[] = seriesConfig
        .map((config, index) => {
          const seriesValue = seriesList[index][valuesIndex];

          switch (config.type) {
            case 'line':
            case 'area':
              return {
                seriesValue,
                x: xScale(seriesValue.__date_unix),
                y: yScale((seriesValue as SeriesValue).__value),
                color: config.color,
                metricProperty: config.metricProperty,
              };
          }
        })
        .filter(isDefined);

      /**
       * Point markers on range data are rendered differently, so we split them
       * out here, so we avoid having to create a union type and complicate
       * things.
       */
      const rangePoints: HoveredPoint<T>[] = seriesConfig
        .flatMap((config, index) => {
          const seriesValue = seriesList[index][valuesIndex];

          switch (config.type) {
            case 'range':
              return [
                {
                  seriesValue,
                  x: xScale(seriesValue.__date_unix),
                  y: yScale((seriesValue as RangeSeriesValue).__value_low),
                  color: config.color,
                  metricProperty: config.metricPropertyLow,
                },
                {
                  seriesValue,
                  x: xScale(seriesValue.__date_unix),
                  y: yScale((seriesValue as RangeSeriesValue).__value_high),
                  color: config.color,
                  metricProperty: config.metricPropertyHigh,
                },
              ];
          }
        })
        .filter(isDefined);

      /**
       * For nearest point calculation we only need to look at the y component
       * of the mouse, since all series originate from the same original value
       * and are thus aligned with the same timestamp.
       */
      const nearestLinePoint = [...linePoints].sort(
        (a, b) => Math.abs(a.y - mousePoint.y) - Math.abs(b.y - mousePoint.y)
      )[0];

      setHoverState({ valuesIndex, linePoints, rangePoints, nearestLinePoint });
    },
    [bisect, values, seriesConfig, seriesList, xScale, yScale]
  );

  return [handleHover, hoverState];
}
