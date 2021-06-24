import {
  endOfDayInSeconds,
  midOfDayInSeconds,
  startOfDayInSeconds,
} from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { voronoi } from '@visx/voronoi';
import { ScaleLinear } from 'd3-scale';
import { first, last } from 'lodash';
import {
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isDefined } from 'ts-is-present';
import { wrapAroundLength } from '~/utils/number';
import { Padding, TimelineEventConfig } from '../../logic';

export interface TimelineEventRange {
  timeline: {
    start: number;
    end: number;
    startIsOutOfBounds: boolean;
    endIsOutOfBounds: boolean;
  };
  highlight: {
    start: number;
    end: number;
  };
}

function getTimelineEventRange(
  config: TimelineEventConfig,
  xScale: ScaleLinear<number, number>
): TimelineEventRange {
  const domain = xScale.domain();
  const min = first(domain) as number;
  const max = last(domain) as number;

  const [start, end] = Array.isArray(config.date)
    ? [midOfDayInSeconds(config.date[0]), midOfDayInSeconds(config.date[1])]
    : [midOfDayInSeconds(config.date), midOfDayInSeconds(config.date)];

  /**
   * The "highlight" is the area drawn over the chart when hovering an event.
   * The start- and end-date are different to "wrap" bars of a day within the
   * area.
   */
  const [highlightStart, highlightEnd] = Array.isArray(config.date)
    ? [startOfDayInSeconds(config.date[0]), endOfDayInSeconds(config.date[1])]
    : [startOfDayInSeconds(config.date), endOfDayInSeconds(config.date)];

  return {
    timeline: {
      start: xScale(Math.max(start, min)),
      end: xScale(Math.min(end, max)),
      startIsOutOfBounds: start < min,
      endIsOutOfBounds: end > max,
    },
    highlight: {
      start: xScale(Math.max(highlightStart, min)),
      end: xScale(Math.min(highlightEnd, max)),
    },
  };
}

export function isVisibleEvent(config: TimelineEventConfig, domain: number[]) {
  const min = first(domain) as number;
  const max = last(domain) as number;

  const [start, end] = Array.isArray(config.date)
    ? [midOfDayInSeconds(config.date[0]), midOfDayInSeconds(config.date[1])]
    : [midOfDayInSeconds(config.date), midOfDayInSeconds(config.date)];

  if (end < start) {
    console.warn(
      'cannot display timeline event with end date before start date:',
      JSON.stringify(config, null, 2)
    );
    return false;
  }

  return min <= end && start <= max;
}

export interface TimelineState {
  index: number | undefined;
  setIndex: (index: number | undefined) => void;
  events: TimelineEventConfig[];
  ranges: TimelineEventRange[];
  current?: {
    event: TimelineEventConfig;
    range: TimelineEventRange;
  };
}

export function useTimelineEventsState(
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
  const { ranges } = timelineState;

  const voronoiLayout = useMemo(
    () =>
      voronoi<TimelineEventRange>({
        x: (x) => x.timeline.start,
        y: () => height,
        width,
        height,
      })(ranges),
    [ranges, width, height]
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
