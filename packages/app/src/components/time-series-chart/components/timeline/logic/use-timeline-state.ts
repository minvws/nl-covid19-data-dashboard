import { ScaleLinear } from 'd3-scale';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { wrapAroundLength } from '~/utils/number';
import { TimelineEventConfig, TimelineState } from './common';
import { getTimelineEventRange } from './get-timeline-event-range';
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
        .sort(
          (a, b) =>
            (Array.isArray(a.date) ? a.date[0] : a.date) -
            (Array.isArray(b.date) ? b.date[0] : b.date)
        ) || [],
    [allEvents, xScale]
  );

  const ranges = useMemo(
    () => events.map((x) => getTimelineEventRange(x, xScale)),
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
        ? { event: events[index], range: ranges[index] }
        : undefined,
    [events, index, ranges]
  );

  return useMemo(
    () => ({ index, setIndex, events, ranges, current }),
    [index, setIndex, events, ranges, current]
  );
}
