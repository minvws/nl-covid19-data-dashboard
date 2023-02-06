import { DateSpanValue, DateValue } from '@corona-dashboard/common';
/**
 * Returns a typed DataScope based on the current route's path
 */

export type TopicalDateConfig = {
  config: { isoWeekOffset: number; startDayOfDate: 0 | 1 | 2 | 3 | 4 | 5 | 6; timeSpanInDays: number };
  inputDate?: Date;
};

const dayInMiliseconds = 86400000;
const weekInMiliseconds = 604800000;

export const getTopicalTileDate = ({ config, inputDate = new Date() }: TopicalDateConfig): DateSpanValue | DateValue => {
  const inputDay = inputDate.getDay();
  const inputDateInUnixTime = inputDate.getTime();
  const weekOffset = config.startDayOfDate > inputDay ? (config.isoWeekOffset + 1) * weekInMiliseconds : config.isoWeekOffset * weekInMiliseconds;
  const startOfTheWeekOffset = weekOffset + inputDay * dayInMiliseconds;
  const dayOffset = config.startDayOfDate * dayInMiliseconds;
  const timespanLengthInMiliseconds = (config.timeSpanInDays - 1) * dayInMiliseconds;

  const IsoWeekStart = inputDateInUnixTime - startOfTheWeekOffset;

  const startDate = IsoWeekStart + dayOffset;
  const endDate = startDate + timespanLengthInMiliseconds;

  const dateResult =
    config.timeSpanInDays === 1
      ? {
          date_unix: startDate / 1000,
        }
      : {
          date_start_unix: startDate / 1000,
          date_end_unix: endDate / 1000,
        };
  return dateResult;
};
