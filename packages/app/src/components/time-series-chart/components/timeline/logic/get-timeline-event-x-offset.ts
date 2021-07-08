import {
  endOfDayInSeconds,
  middleOfDayInSeconds,
  startOfDayInSeconds,
} from '@corona-dashboard/common';
import { ScaleLinear } from 'd3-scale';
import { first, last } from 'lodash';
import { TimelineEventConfig, TimelineEventXOffset } from './common';

export function getTimelineEventXOffset(
  config: TimelineEventConfig,
  xScale: ScaleLinear<number, number>
): TimelineEventXOffset {
  const domain = xScale.domain();
  const min = first(domain) as number;
  const max = last(domain) as number;

  const [start, end] = [
    middleOfDayInSeconds(config.start),
    middleOfDayInSeconds(config.end || config.start),
  ];

  /**
   * The "highlight" is the area drawn over the chart when hovering an event.
   * The start- and end-date are different to "wrap" bars of a day within the
   * area.
   */
  const [highlightStart, highlightEnd] = [
    startOfDayInSeconds(config.start),
    endOfDayInSeconds(config.end || config.start),
  ];

  return {
    timeline: {
      x0: xScale(Math.max(start, min)),
      x1: xScale(Math.min(end, max)),
      x0IsOutOfBounds: start < min,
      x1IsOutOfBounds: end > max,
    },
    highlight: {
      x0: xScale(Math.max(highlightStart, min)),
      x1: xScale(Math.min(highlightEnd, max)),
    },
  };
}
