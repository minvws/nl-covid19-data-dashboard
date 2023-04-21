import { middleOfDayInSeconds } from '@corona-dashboard/common';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { SeverityIndicatorTimelineEventConfig } from './timeline';

/**
 * Calculated the difference, in days, between two dates.
 * @param start - the start date of a given range
 * @param end - the end date of a given range
 * @returns the number of days between two dates
 */
export const getDifferenceInDays = (start: Date, end: Date): number => {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
};

/**
 * Calculates the middle of the day for each passed in date (either today or the start and end date for a given range).
 * @param today - today's Date object
 * @param startDate - the start date of a given range
 * @param endDate - the end date of a given range
 * @returns the date representing the middle of the day for the passed in dates
 */
const getMiddleOfDayDates = (today: Date, startDate: number, endDate: number): Record<string, Date> => {
  const todayMiddleOfDayDate = createDateFromUnixTimestamp(middleOfDayInSeconds(today.getTime() / 1000));
  const startOfIntervalDate = createDateFromUnixTimestamp(middleOfDayInSeconds(startDate));
  const endOfIntervalDate = createDateFromUnixTimestamp(middleOfDayInSeconds(endDate));

  return {
    startOfIntervalDate,
    endOfIntervalDate,
    todayMiddleOfDayDate,
  };
};

/**
 * Calculates the relative offset value for the 'Today' label on the timeline.
 * @param today - today's Date object
 * @param startDate - the start date of the timeline
 * @param endDate - the end date of the timeline
 * @returns the relative offset value for the 'Today' label on the timeline
 */
export const getTimelineBarArrowOffset = (today: Date, startDate: number, endDate: number): number => {
  const { startOfIntervalDate, endOfIntervalDate, todayMiddleOfDayDate } = getMiddleOfDayDates(today, startDate, endDate);
  const numberOfDaysInInterval = getDifferenceInDays(startOfIntervalDate, endOfIntervalDate);
  const numberOfDaysFromStartToToday = getDifferenceInDays(startOfIntervalDate, todayMiddleOfDayDate);
  const arrowOffset = (numberOfDaysFromStartToToday / numberOfDaysInInterval) * 100;

  return arrowOffset;
};

/**
 * Calculates the amount of relative width a timeline bar part covers.
 * @param daysInBarPart - the amount of days in a timeline bar part
 * @param totalDays - the total amount of days in a timeline
 * @returns the relative width of a timeline bar part
 */
export const getTimelineBarPartWidth = (daysInBarPart: ReturnType<typeof getDifferenceInDays>, totalDays: number) => (daysInBarPart / totalDays) * 100;

/**
 * Calculates the start and end date of a given timeline range.
 * @param timelineEvents - the timeline events/range to calculate the start and end dates for
 * @returns the start and end date of the given timeline range
 */
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
