/**
 * Calculates the amount of days a timeline bar part covers.
 * @param startDate - the start date of the timeline bar part
 * @param endDate - the end date of the timeline bar part
 * @returns the amount of days in a timeline bar part contains
 */
export const getTimelineBarPartDays = (startDate: number, endDate: number) => (endDate - startDate) / (1000 * 3600 * 24);
