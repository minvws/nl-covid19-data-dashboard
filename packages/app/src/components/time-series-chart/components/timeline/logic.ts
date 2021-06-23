import {
  endOfDayInSeconds,
  midOfDayInSeconds,
  startOfDayInSeconds,
} from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { voronoi } from '@visx/voronoi';
import { ScaleBand, ScaleLinear } from 'd3-scale';
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

type Event = React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>;

export function getTimelineEventRange(
  config: TimelineEventConfig,
  domain: number[]
) {
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
      start: Math.max(start, min),
      end: Math.min(end, max),
      startIsOutOfBounds: start < min,
      endIsOutOfBounds: end > max,
    },
    highlight: {
      start: Math.max(highlightStart, min),
      end: Math.min(highlightEnd, max),
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

  return useMemo(
    () => ({ index, setIndex, events }),
    [index, setIndex, events]
  );
}

export function useTimelineHoverHandler(
  onHover: (index: number | undefined) => void,
  {
    events,
    xScale,
    padding,
    width,
  }: {
    events: TimelineEventConfig[];
    xScale: ScaleLinear<number, number> | ScaleBand<number>;
    padding: Padding;
    width: number;
  }
) {
  const voronoiLayout = useMemo(
    () =>
      voronoi<TimelineEventConfig>({
        x: (x) => xScale(Array.isArray(x.date) ? x.date[0] : x.date) as number,
        y: () => 25,
        width,
        height: 50,
      })(events),
    [events, width, xScale]
  );

  return useCallback(
    (event: TouchEvent | MouseEvent) => {
      const mousePoint = localPoint(event.currentTarget, event as Event);

      if (event.type === 'mouseleave' || !mousePoint) {
        onHover(undefined);
        return;
      }

      const closest =
        voronoiLayout.find(mousePoint.x - padding.left, mousePoint.y, 30) ||
        undefined;

      onHover(closest?.index);
    },
    [padding.left, onHover, voronoiLayout]
  );
}
