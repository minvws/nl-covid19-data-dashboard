import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { SeverityIndicatorTimelineEventConfig } from '../timeline';

export const getTimelineRangeDates = (timelineEvents: SeverityIndicatorTimelineEventConfig[]) => {
  const timelineEventDates = timelineEvents
    .flatMap((timelineEvent: SeverityIndicatorTimelineEventConfig) => [timelineEvent.start, timelineEvent.end])
    .map((timelineEventDate: number) => {
      return createDateFromUnixTimestamp(timelineEventDate).getTime();
    });

  return {
    startDate: Math.min(...timelineEventDates),
    endDate: Math.max(...timelineEventDates),
  };
};
