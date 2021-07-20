import { useCallback, useState, useRef } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { isEmpty } from 'lodash';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { TimestampedValue } from '@corona-dashboard/common';
import { SeriesSingleValue } from '~/components/time-series-chart/logic';
import { SeriesList, SeriesConfig } from './series';

interface UseHoverStateArgs<T extends TimestampedValue> {
  values: T[];
  seriesList: SeriesList;
  seriesConfig: SeriesConfig<T>;
  xScale: ScaleBand<number>;
  yScale: ScaleLinear<number, number>;
}

export type HoveredPoint<T> = {
  seriesValue: SeriesSingleValue;
  metricProperty: keyof T;
  seriesConfigIndex: number;
  color: string;
  x: number;
  y: number;
};

interface HoverState<T> {
  valuesIndex: number;
  barPoints: HoveredPoint<T>[];
  nearestPoint: HoveredPoint<T>;
}

type Event = React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>;

type HoverHandler = (event: Event, valuesIndex: number) => void;

type UseHoverStateResponse<T extends TimestampedValue> = [
  HoverHandler,
  HoverState<T> | undefined
];

export function useHoverState<T extends TimestampedValue>({
  values,
  seriesList,
  seriesConfig,
  xScale,
  yScale,
}: UseHoverStateArgs<T>): UseHoverStateResponse<T> {
  const [hoverState, setHoverState] = useState<HoverState<T>>();
  const timeoutRef = useRef<any>();

  const handleHover = useCallback(
    (event: Event, valuesIndex: number) => {
      if (isEmpty(values) || !isDefined(valuesIndex)) {
        return;
      }

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

      const barPoints: HoveredPoint<T>[] = seriesConfig
        .map((config, index) => {
          const seriesValue = seriesList[index][valuesIndex] as
            | SeriesSingleValue
            | undefined;

          if (!isPresent(seriesValue)) {
            return;
          }

          const xValue = seriesValue.__date_unix;
          const yValue = seriesValue.__value;

          /**
           * Filter series without Y value on the current valuesIndex
           */
          if (!isPresent(yValue)) {
            return;
          }

          return {
            seriesValue,
            x: (xScale(xValue) || 0) + xScale.bandwidth() / 2,
            y: yScale(yValue),
            color: config.color,
            metricProperty: config.metricProperty,
            seriesConfigIndex: index,
          };
        })
        .filter(isDefined);

      setHoverState({
        valuesIndex,
        barPoints,
        // NOTE: This is currently returning the first bar as the "nearestPoint"
        // since this is only being used with one series. Additional logic should be
        // added in the future if this chart is used to display multiple bars/stacked bars
        nearestPoint: barPoints[0],
      });
    },
    [xScale, yScale, seriesList, values, seriesConfig]
  );

  return [handleHover, hoverState];
}
