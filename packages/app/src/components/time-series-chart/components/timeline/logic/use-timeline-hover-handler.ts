import { localPoint } from '@visx/event';
import { voronoi } from '@visx/voronoi';
import { MouseEvent, TouchEvent, useCallback, useMemo } from 'react';
import { Padding } from '~/components/time-series-chart/logic';
import { TimelineEventXOffset, TimelineState } from './common';

export function useTimelineHoverHandler(
  onHover: (index: number | undefined) => void,
  {
    timelineState,
    padding,
    width,
    height,
  }: {
    timelineState: TimelineState;
    padding: Padding;
    width: number;
    height: number;
  }
) {
  const voronoiLayout = useMemo(
    () =>
      voronoi<TimelineEventXOffset>({
        x: (x) => x.timeline.x0,
        y: () => height,
        width,
        height,
      })(timelineState.xOffsets),
    [timelineState.xOffsets, width, height]
  );

  return useCallback(
    (event: TouchEvent | MouseEvent) => {
      const distance = 45;
      const mousePoint = localPoint(event.currentTarget, event);

      if (event.type === 'mouseleave' || !mousePoint) {
        onHover(undefined);
        return;
      }

      const closest = voronoiLayout.find(
        mousePoint.x - padding.left,
        mousePoint.y,
        distance
      );

      onHover(closest?.index);
    },
    [padding.left, onHover, voronoiLayout]
  );
}
