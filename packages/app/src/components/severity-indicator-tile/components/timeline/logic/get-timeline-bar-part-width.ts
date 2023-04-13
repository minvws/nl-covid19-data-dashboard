import { getTimelineBarPartDays } from './get-timeline-bar-part-days';

/**
 * Calculates the amount of relative width a timeline bar part covers.
 * @param daysInBarPart - the amount of days in a timeline bar part
 * @param totalDays - the total amount of days in a timeline
 * @returns the relative width of a timeline bar part
 */
export const getTimelineBarPartWidth = (daysInBarPart: ReturnType<typeof getTimelineBarPartDays>, totalDays: number) => (daysInBarPart / totalDays) * 100;
