import { useCallback, useState } from 'react';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { localPoint } from '@visx/event';
import { isEmpty } from 'lodash';
import { SeriesSingleValue } from '~/components-styled/time-series-chart/logic/series';

interface UseHoverStateArgs {
  series: SeriesSingleValue[];
  paddingLeft: number;
  xScale: ScaleBand<number>;
  yScale: ScaleLinear<number, number>;
}

export type HoveredPoint = {
  value: SeriesSingleValue;
  x: number;
  y: number;
};

interface HoverState {
  index: number;
  point: HoveredPoint;
}

type Event = React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>;

export type HoverHandler = (event: Event) => void;

type UseHoverStateResponse = [HoverHandler, HoverState | undefined];

export function useHoverState({
  series,
  paddingLeft,
  xScale,
  yScale,
}: UseHoverStateArgs): UseHoverStateResponse {
  const [hoverState, setHoverState] = useState<HoverState>();

  const bisect = useCallback(
    function (xPosition: number): number {
      const bandWidth = xScale.step();
      return Math.floor((xPosition - paddingLeft) / bandWidth);
    },
    [paddingLeft, xScale]
  );

  const handleHover = useCallback(
    (event: Event) => {
      if (event.type === 'mouseleave') {
        setHoverState(undefined);
        return;
      }

      if (isEmpty(series)) {
        return;
      }

      const mousePoint = localPoint(event);
      if (!mousePoint) {
        return;
      }

      const index = bisect(mousePoint.x);
      const value = series[index];

      if (!value) {
        setHoverState(undefined);
        return;
      }

      setHoverState({
        index,
        point: {
          value,
          x: xScale(value.__date_unix) + xScale.bandwidth() / 2,
          y: yScale(value.__value),
        },
      });
    },
    [bisect, series, xScale]
  );

  return [handleHover, hoverState];
}
