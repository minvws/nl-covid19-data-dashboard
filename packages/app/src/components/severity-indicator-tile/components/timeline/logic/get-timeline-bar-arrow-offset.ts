import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';

// Returns the difference between two dates in days.
const getDifferenceInDays = (start: Date, end: Date): number => {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
};

// Determines where to position the 'Vandaag' label on the timeline.
export const getTimelineBarArrowOffset = (today: Date, startDate: number, endDate: number): number => {
  const startOfIntervalDate = createDateFromUnixTimestamp(startDate);
  const endOfIntervalDate = createDateFromUnixTimestamp(endDate);
  const noOfDaysInInterval = getDifferenceInDays(startOfIntervalDate, endOfIntervalDate);
  const noOfDaysFromStartToToday = getDifferenceInDays(startOfIntervalDate, today);
  const arrowOffset = (noOfDaysFromStartToToday / noOfDaysInInterval) * 100;

  return arrowOffset;
};
