import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { middleOfDayInSeconds } from '@corona-dashboard/common';

// Returns the difference between two dates in days.
const getDifferenceInDays = (start: Date, end: Date): number => {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
};

// Returns the date representing the middle of the day for the passed in dates.
const getMiddleOfDayDates = (today: Date, startDate: number, endDate: number): Record<string, Date> => {
  const todayMiddleOfDaySeconds = middleOfDayInSeconds(today.getTime() / 1000);

  return {
    startOfIntervalDate: createDateFromUnixTimestamp(middleOfDayInSeconds(startDate)),
    endOfIntervalDate: createDateFromUnixTimestamp(middleOfDayInSeconds(endDate)),
    todayMiddleOfDayDate: createDateFromUnixTimestamp(todayMiddleOfDaySeconds),
  };
};

// Determines where to position the 'Vandaag' label on the timeline.
export const getTimelineBarArrowOffset = (today: Date, startDate: number, endDate: number): number => {
  const { startOfIntervalDate, endOfIntervalDate, todayMiddleOfDayDate } = getMiddleOfDayDates(today, startDate, endDate);
  const numberOfDaysInInterval = getDifferenceInDays(startOfIntervalDate, endOfIntervalDate);
  const numberOfDaysFromStartToToday = getDifferenceInDays(startOfIntervalDate, todayMiddleOfDayDate);
  const arrowOffset = (numberOfDaysFromStartToToday / numberOfDaysInInterval) * 100;

  return arrowOffset;
};
