import { DateSpanValue, DateValue, isDateSeries, isDateSpanSeries, startOfDayInSeconds, TimestampedValue } from '../../data-sorting';
import { DAY_IN_SECONDS } from '../../time';

export enum TimeframeOption {
  ONE_WEEK = '1_week',
  FIVE_WEEKS = '5_weeks',
  THIRTY_DAYS = '30_days',
  THREE_MONTHS = '3_months',
  SIX_MONTHS = '6_months',
  LAST_YEAR = 'last_year',
  ALL = 'all',
}

export const TimeframeOptionsList = [TimeframeOption.ALL, TimeframeOption.THIRTY_DAYS, TimeframeOption.THREE_MONTHS, TimeframeOption.SIX_MONTHS, TimeframeOption.LAST_YEAR];

export function getDaysForTimeframe(timeframe: TimeframeOption): number {
  switch (timeframe) {
    case TimeframeOption.ONE_WEEK:
      return 7;
    case TimeframeOption.FIVE_WEEKS:
      return 5 * 7;
    case TimeframeOption.THIRTY_DAYS:
      return 30;
    case TimeframeOption.THREE_MONTHS:
      return 92;
    case TimeframeOption.SIX_MONTHS:
      return 183;
    case TimeframeOption.LAST_YEAR:
      return 365;
    case TimeframeOption.ALL:
      return Infinity;
    default: {
      // make sure that all timeframes are implemented correctly
      const exhaustive: never = timeframe;
      throw exhaustive;
    }
  }
}

const oneDayInMilliseconds = DAY_IN_SECONDS * 1000;

export const getMinimumUnixForTimeframe = (timeframe: TimeframeOption, endDate: Date): number => {
  if (timeframe === TimeframeOption.ALL) {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return endDate.getTime() - days * oneDayInMilliseconds;
};

type CompareCallbackFunction<T> = (value: T) => number;

/**
 * Filter arrays of any provided types based on the timeframe. Uses a callback
 * to retrieve the unix time zone to compare with.
 * @param values
 * @param timeframe
 * @param endDate
 * @param compareCallback
 */
export const getFilteredValues = <T>(values: T[], timeframe: TimeframeOption, endDate: Date, compareCallback: CompareCallbackFunction<T>): T[] => {
  const minimumUnix = getMinimumUnixForTimeframe(timeframe, endDate);
  return values.filter((value: T): boolean => {
    return compareCallback(value) >= minimumUnix;
  });
};

/**
 * From a list of values, return the ones that are within the timeframe.
 *
 * This is similar to getFilteredValues but here we assume the value is passed
 * in as-is from the data, and we detect what type of timestamp we should filter
 * on.
 */
export function getValuesInTimeframe<T extends TimestampedValue>(values: T[], timeframe: TimeframeOption, endDate: Date): T[] {
  const start = getTimeframeBoundaryUnix(timeframe, endDate);
  const end = Math.ceil(endDate.getTime() / 1000);

  if (isDateSeries(values)) {
    return values.filter((x: DateValue) => {
      const correctedDateUnix = startOfDayInSeconds(x.date_unix);
      return correctedDateUnix >= start && correctedDateUnix <= end;
    }) as T[];
  }

  if (isDateSpanSeries(values)) {
    return values.filter((x: DateSpanValue) => {
      const correctedDateUnix = startOfDayInSeconds(x.date_end_unix);
      return correctedDateUnix >= start && correctedDateUnix <= end;
    }) as T[];
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}

function getTimeframeBoundaryUnix(timeframe: TimeframeOption, endDate: Date): number {
  if (timeframe === TimeframeOption.ALL) {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return startOfDayInSeconds(endDate.getTime() / 1000) - days * DAY_IN_SECONDS;
}
