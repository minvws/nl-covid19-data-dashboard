import {
  DateSpanValue,
  DateValue,
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';

export type TimeframeOption = 'all' | '5weeks' | 'week';

export const getDaysForTimeframe = (timeframe: TimeframeOption): number => {
  // adds 1 extra day to capture the intended amount of days
  if (timeframe === 'week') {
    return 8;
  }
  if (timeframe === '5weeks') {
    return 36;
  }
  return Infinity;
};

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

export const getMinimumUnixForTimeframe = (
  timeframe: TimeframeOption,
  today: Date
): number => {
  if (timeframe === 'all') {
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

const oneDayInSeconds = 24 * 60 * 60;

function getTimeframeBoundaryUnix(timeframe: TimeframeOption, today: Date) {
  if (timeframe === 'all') {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return today.getTime() / 1000 - days * oneDayInSeconds;
}
