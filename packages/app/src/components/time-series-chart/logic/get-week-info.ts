/**
 * @TODO: adjust this utility to work with unix time stamps instead of date objects.
 *
 * ---
 *
 * Code inspired by
 * https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 *
 * For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year is the year of the week
 * number. Then get weeks between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous or next year, overlap is
 * up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015 2012/1/1   is Sunday in week 52
 *      of 2011
 */
export function getWeekInfo(d: Date) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number Make
  // Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  const weekStartDate = new Date(d.getTime());
  weekStartDate.setUTCDate(weekStartDate.getUTCDate() - 3);

  const weekEndDate = new Date(d.getTime());
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 3);

  return {
    year: d.getUTCFullYear(),
    weekNumber,
    weekStartDate,
    weekEndDate,
  } as const;
}
