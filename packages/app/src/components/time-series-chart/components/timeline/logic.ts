import { endOfDayInSeconds, startOfDayInSeconds } from '~/utils/date';
import { TimelineEventConfig } from '../../logic';

export function getTimelineEventStartEnd(
  config: TimelineEventConfig,
  domain: [number, number]
) {
  const [min, max] = domain;
  const [start, end] = Array.isArray(config.date)
    ? config.date
    : [startOfDayInSeconds(config.date), endOfDayInSeconds(config.date)];

  /**
   * Clip the start / end dates to the domain of the x-axis, so that we can
   * conveniently pass in things like Infinity for end date.
   */
  return [Math.max(start, min), Math.min(end, max)] as const;
}
