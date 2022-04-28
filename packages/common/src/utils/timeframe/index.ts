import {
  DateSpanValue,
  DateValue,
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '../../data-sorting';
import { DAY_IN_SECONDS } from '../../time';

export enum TimeframeOption {
  ONE_WEEK = '1week',
  FIVE_WEEKS = '5weeks',
  THIRTY_DAYS = '30days',
  THREE_MONTHS = '3months',
  SIX_MONTHS = '6months',
  LAST_YEAR = 'lastYear',
  FIRST_OF_SEPTEMBER = 'firstOfSeptember',
  ALL = 'all',
}

export const TimeframeOptionsList = [
  TimeframeOption.ALL,
  TimeframeOption.ONE_WEEK,
  TimeframeOption.THIRTY_DAYS,
  TimeframeOption.THREE_MONTHS,
  TimeframeOption.SIX_MONTHS,
  TimeframeOption.LAST_YEAR,
];

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
    case TimeframeOption.FIRST_OF_SEPTEMBER: {
      const date = new Date('1 September 2020');
      const today = new Date();
      const diffInDays = Math.round(
        Math.abs(date.valueOf() - today.valueOf()) / (1000 * DAY_IN_SECONDS) - 1
      );
      return diffInDays;
    }
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

export const getMinimumUnixForTimeframe = (
  timeframe: TimeframeOption,
  today: Date
): number => {
  if (timeframe === TimeframeOption.ALL) {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return today.getTime() - days * oneDayInMilliseconds;
};

type CompareCallbackFunction<T> = (value: T) => number;

/**
 * Filter arrays of any provided types based on the timeframe. Uses a callback
 * to retrieve the unix time zone to compare with.
 * @param values
 * @param timeframe
 * @param compareCallback
 */
export const getFilteredValues = <T>(
  values: T[],
  timeframe: TimeframeOption,
  today: Date,
  compareCallback: CompareCallbackFunction<T>
): T[] => {
  const minimumUnix = getMinimumUnixForTimeframe(timeframe, today);
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
export function getValuesInTimeframe<T extends TimestampedValue>(
  values: T[],
  timeframe: TimeframeOption,
  today: Date
): T[] {
  const boundary = getTimeframeBoundaryUnix(timeframe, today);

  if (isDateSeries(values)) {
    return values.filter((x: DateValue) => x.date_unix >= boundary) as T[];
  }

  if (isDateSpanSeries(values)) {
    return values.filter(
      (x: DateSpanValue) => x.date_end_unix >= boundary
    ) as T[];
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}

function getTimeframeBoundaryUnix(timeframe: TimeframeOption, today: Date) {
  if (timeframe === TimeframeOption.ALL) {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return Math.floor(today.getTime() / 1000) - days * DAY_IN_SECONDS;
}
