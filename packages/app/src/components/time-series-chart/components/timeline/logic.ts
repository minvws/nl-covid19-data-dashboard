import {
  endOfDayInSeconds,
  midOfDayInSeconds,
  startOfDayInSeconds,
  TimestampedValue,
} from '@corona-dashboard/common';
import { last } from 'lodash';
import { first } from 'lodash';
import { useEffect, useState } from 'react';
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

export function useTimelineEventIndex<T extends TimestampedValue>(values: T[]) {
  const [timelineEventIndex, setTimelineEventIndex] = useState<
    number | undefined
  >(undefined);

  /**
   * It is possible the index is not part of the new values range,
   * therefore reset the index when the values change.
   */
  useEffect(() => setTimelineEventIndex(undefined), [values]);

  return [timelineEventIndex, setTimelineEventIndex] as const;
}
