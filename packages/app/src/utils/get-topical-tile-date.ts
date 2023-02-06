import { DateSpanValue, DateValue } from '@corona-dashboard/common';
/**
 * Returns a typed DataScope based on the current route's path
 */

export type TopicalDateConfig = {
  config: { isoWeekOffset: number; startDayOfDate: 0 | 1 | 2 | 3 | 4 | 5 | 6; timeSpanInDays: number };
  inputDate?: Date;
};

const dayInSeconds = 86400;
const weekInSeconds = 604800;

export const getTopicalTileDate = ({ config, inputDate = new Date() }: TopicalDateConfig): DateSpanValue | DateValue => {
  const currentDay = inputDate.getDay();
  const weekOffset = config.startDayOfDate < currentDay ? (config.isoWeekOffset + 1) * weekInSeconds : config.isoWeekOffset * weekInSeconds;
  const dayOffset = config.startDayOfDate * dayInSeconds;
  const timespanLengthInSeconds = config.timeSpanInDays - 1 * dayInSeconds;

  const startDate = inputDate.getTime() / 1000 - weekOffset + dayOffset;
  const endDate = startDate + timespanLengthInSeconds;

  const dateResult =
    config.timeSpanInDays === 1
      ? {
          date_unix: startDate,
        }
      : {
          date_start_unix: startDate,
          date_end_unix: endDate,
        };
  return dateResult;
};
