import { createFormatting } from '@corona-dashboard/common';

export interface ThemeTileDateConfig {
  weekOffset: number;
  startDayOfDate: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  timeSpanInDays: number;
}

/** Returns a object with the start and end date in seconds. Or a single unix date in seconds if it only contains one date. */
export interface TopicalDateConfig {
  config: ThemeTileDateConfig;
  language: 'Nederlands' | 'Engels';
  inputDate?: Date;
}

const languages = { Nederlands: 'nl-NL', Engels: 'en-GB' };
const dayInMiliseconds = 86400000;
const weekInMiliseconds = 604800000;

export const getTileDateConfig = ({ config, inputDate = new Date(), language }: TopicalDateConfig): string => {
  const { formatDateFromMilliseconds, formatDateSpan } = createFormatting(languages[language], {
    date_day_before_yesterday: 'eergisteren',
    date_today: 'vandaag',
    date_yesterday: 'gisteren',
  });

  /**
   * Get the current index of the day of the week for the given input date.
   * Starting with Sunday as index 0 and Saturday as index 6
   * Sunday = 0
   * Monday = 1
   * Tuesday = 2
   * Wednesday = 3
   * Thursday = 4
   * Friday = 5
   * Saturday = 6
   */
  const inputDateWeekDay = inputDate.getDay();

  // Get the unix timestamp for the given input date.
  const inputDateInUnixTime = inputDate.getTime();

  /**
   * Calulate how many milliseconds ago a IsoIndex was.
   * (This would not be the data of that week.
   * But the milliseconds passed since that week until the given input date.)
   *
   * Check if the weekday of given input date already passed the start day in the config.
   * If so, calculate how many milliseconds ago the
   * If not, add 1 week to the offset and calculate the amount of milliseconds for that offset
   * This is done because: if the offset is from last wedsnesday too the one before last wednesday.
   * We need to check if wedsneday already happened. Otherwise we need to add another week
   */
  const millisecondsPassedSinceWeekOffset = config.startDayOfDate > inputDateWeekDay ? (config.weekOffset + 1) * weekInMiliseconds : config.weekOffset * weekInMiliseconds;

  // Now we set the start of the week by having the weekday of the given input added to the week offset.
  // Basicly this always sets the week offset in milliseconds to the sunday of that week in the past.
  const startOfTheWeekInMilliSecondsPassed = millisecondsPassedSinceWeekOffset + inputDateWeekDay * dayInMiliseconds;

  // get the milliseconds offset from the given input date weekday to the previous sunday.
  const millisecondsPassedSinceSunday = config.startDayOfDate * dayInMiliseconds;

  // Get the length of the timespan in milliseconds
  const timespanLengthInMiliseconds = (config.timeSpanInDays - 1) * dayInMiliseconds;

  // convert the weeks past in seconds to the actual date in milliseconds
  const dateOfStartWeek = inputDateInUnixTime - startOfTheWeekInMilliSecondsPassed;

  // get form the sunday from the week to start to the day of the week that needs to be dsiplayed.
  const startDate = dateOfStartWeek + millisecondsPassedSinceSunday;

  // Get the end date by adding the millisecond of the timespan to the start date.
  const endDate = startDate + timespanLengthInMiliseconds;

  // Check if timespan is greater than one day. Or it's just a single day. create the return object.
  const dateResult = config.timeSpanInDays === 1 ? formatDateFromMilliseconds(startDate, 'medium') : formatDateSpan(new Date(startDate), new Date(endDate), 'medium').join(' - ');
  return dateResult;
};
