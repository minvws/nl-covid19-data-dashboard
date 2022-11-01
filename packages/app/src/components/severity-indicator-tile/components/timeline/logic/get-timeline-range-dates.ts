import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { SeverityIndicatorTimelineEventConfig } from '../timeline';

export const getTimelineRangeDates = (timelineEvents: SeverityIndicatorTimelineEventConfig[] | undefined) => {
  if (!timelineEvents) {
    return {
      startDate: null,
      endDate: null,
    };
  }

  const timelineEventDates = timelineEvents
    .flatMap((timelineEvent: SeverityIndicatorTimelineEventConfig) => [timelineEvent.start, timelineEvent.end])
    .map((timelineEventDate: number) => {
      return createDateFromUnixTimestamp(timelineEventDate).getTime();
    });

  const sortedTimelineEventDates = timelineEventDates.sort();

  return {
    startDate: Math.min(...sortedTimelineEventDates),
    endDate: Math.max(...sortedTimelineEventDates),
  };
};
