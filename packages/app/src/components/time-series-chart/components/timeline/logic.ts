import {
  endOfDayInSeconds,
  midOfDayInSeconds,
  startOfDayInSeconds,
} from '@corona-dashboard/common';
import { ScaleLinear } from 'd3-scale';
import { first, last } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { wrapAroundLength } from '~/utils/number';
import { TimelineEventConfig } from '../../logic';

export function getTimelineEventRange(
  config: TimelineEventConfig,
  domain: number[]
) {
  const min = first(domain) as number;
  const max = last(domain) as number;

  const [start, end] = Array.isArray(config.date)
    ? [midOfDayInSeconds(config.date[0]), midOfDayInSeconds(config.date[1])]
    : [midOfDayInSeconds(config.date), midOfDayInSeconds(config.date)];

  const [annotationStart, annotationEnd] = Array.isArray(config.date)
    ? [startOfDayInSeconds(config.date[0]), endOfDayInSeconds(config.date[1])]
    : [startOfDayInSeconds(config.date), endOfDayInSeconds(config.date)];

  return {
    timeline: {
      start: Math.max(start, min),
      end: Math.min(end, max),
    },
    // @TODO rename to highlight
    annotation: {
      start: Math.max(annotationStart, min),
      end: Math.min(annotationEnd, max),
    },
  };
}

export function isVisibleEvent(config: TimelineEventConfig, domain: number[]) {
  const min = first(domain) as number;
  const max = last(domain) as number;

  const [start, end] = Array.isArray(config.date)
    ? [midOfDayInSeconds(config.date[0]), midOfDayInSeconds(config.date[1])]
    : [midOfDayInSeconds(config.date), midOfDayInSeconds(config.date)];

  return min <= end && start <= max;
}

export function useTimelineEventsState(
  allEvents: TimelineEventConfig[] | undefined,
  xScale: ScaleLinear<number, number>
) {
  const [index, _setIndex] = useState<number | undefined>(undefined);
  const events = useMemo(
    () => allEvents?.filter((x) => isVisibleEvent(x, xScale.domain())) || [],
    [allEvents, xScale]
  );

  /**
   * It is possible the index is not part of the new values range,
   * therefore reset the index when the values change.
   */
  useEffect(() => _setIndex(undefined), [xScale]);

  const setIndex = useCallback(
    (index: number | undefined) =>
      _setIndex(
        isDefined(index) ? wrapAroundLength(index, events.length) : undefined
      ),
    [events.length]
  );

  return useMemo(
    () => ({ index, setIndex, events }),
    [index, setIndex, events]
  );
}
