export const getTimelineRangeDates = (timelineEvents: any) => {
  const timelineEventDates = timelineEvents
    .flatMap((timelineEvent: any) => [
      timelineEvent.date,
      timelineEvent.dateEnd,
    ])
    .map((timelineEventDate: string) => new Date(timelineEventDate).getTime());

  const sortedTimelineEventDates = timelineEventDates.sort();

  return {
    startDate: Math.min(...sortedTimelineEventDates),
    endDate: Math.max(...sortedTimelineEventDates),
  };
};
