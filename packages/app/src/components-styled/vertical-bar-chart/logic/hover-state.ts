import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { bisectCenter } from 'd3-array';
import { ScaleBand } from 'd3-scale';
import { isEmpty } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { TimespanAnnotationConfig } from './common';
import {
  BarSeriesDefinition,
  SeriesDoubleValue,
  SeriesList,
  SeriesSingleValue,
} from './series';

interface UseHoverStateArgs<T extends TimestampedValue> {
  values: T[];
  paddingLeft: number;
  xScale: ScaleBand<number>;
}

interface HoverState<T> {
  index: number;
  value: SeriesSingleValue;
}

type Event = React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>;

export type HoverHandler = (event: Event) => void;

type UseHoverStateResponse<T> = [HoverHandler, HoverState<T> | undefined];

export function useHoverState<T extends TimestampedValue>({
  values,
  paddingLeft,
  xScale,
}: UseHoverStateArgs<T>): UseHoverStateResponse<T> {
  const [hoverState, setHoverState] = useState<HoverState<T>>();

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

      if (isEmpty(values)) {
        return;
      }

      const mousePoint = localPoint(event);
      if (!mousePoint) {
        return;
      }

      const index = bisect(mousePoint.x);

      setHoverState({
        index,
        value: values[index],
      });
    },
    [bisect, values, xScale]
  );

  return [handleHover, hoverState];
}
