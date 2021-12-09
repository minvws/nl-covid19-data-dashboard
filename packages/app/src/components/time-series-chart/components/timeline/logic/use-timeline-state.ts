import { ScaleLinear } from 'd3-scale';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { wrapAroundLength } from '~/utils/wrap-around-length';
import { TimelineEventConfig, TimelineState } from './common';
import { getTimelineEventXOffset } from './get-timeline-event-x-offset';
import { isVisibleEvent } from './is-visible-event';

export function useTimelineState(
  allEvents: TimelineEventConfig[] | undefined,
  xScale: ScaleLinear<number, number>
): TimelineState {
  const [index, _setIndex] = useState<number | undefined>(undefined);
  const events = useMemo(
    () =>
      allEvents
        ?.filter((x) => isVisibleEvent(x, xScale.domain()))
        .sort((a, b) => a.start - b.start) || [],
    [allEvents, xScale]
  );

  const xOffsets = useMemo(
    () => events.map((x) => getTimelineEventXOffset(x, xScale)),
    [events, xScale]
  );

  /**
   * It is possible the index is not part of the new xScale-range,
   * therefore we'll just reset the index when the xScale changes.
   */
  useEffect(() => _setIndex(undefined), [xScale]);

  const setIndex = useCallback(
    (index: number | undefined) =>
      _setIndex(
        isDefined(index) ? wrapAroundLength(index, events.length) : undefined
      ),
    [events.length]
  );

  const current = useMemo(
    () =>
      isDefined(index)
        ? { event: events[index], xOffset: xOffsets[index] }
        : undefined,
    [events, index, xOffsets]
  );

  return useMemo(
    () => ({ index, setIndex, events, xOffsets, current }),
    [index, setIndex, events, xOffsets, current]
  );
}
