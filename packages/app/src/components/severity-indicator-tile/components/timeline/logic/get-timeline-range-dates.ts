import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';

export const getTimelineRangeDates = (timelineEvents: any) => {
  const timelineEventDates = timelineEvents
    .flatMap((timelineEvent: any) => [timelineEvent.start, timelineEvent.end])
    .map((timelineEventDate: number) => {
      return createDateFromUnixTimestamp(timelineEventDate).getTime();
    });

  const sortedTimelineEventDates = timelineEventDates.sort();

  return {
    startDate: Math.min(...sortedTimelineEventDates),
    endDate: Math.max(...sortedTimelineEventDates),
  };
};
