import {
  endOfDayInSeconds,
  midOfDayInSeconds,
  startOfDayInSeconds,
} from '@corona-dashboard/common';
import { ScaleLinear } from 'd3-scale';
import { first, last } from 'lodash';
import { TimelineEventConfig, TimelineEventRange } from './common';

export function getTimelineEventRange(
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
