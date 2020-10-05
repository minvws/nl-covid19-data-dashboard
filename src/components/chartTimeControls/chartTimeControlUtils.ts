import { TimeframeOption } from '.';

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
  timeframe: TimeframeOption
): number => {
  if (timeframe === 'all') {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return new Date().getTime() - days * oneDayInMilliseconds;
};

type CompareCallbackFunction<T> = (value: T) => number;

/**
 * Filter arrays of any provided types based on the timeframe.
 * Uses a callback to retrieve the unix time zone to compare with.
 * @param values
 * @param timeframe
 * @param compareCallback
 */
export const getFilteredValues = <T>(
  values: T[],
  timeframe: TimeframeOption,
  compareCallback: CompareCallbackFunction<T>
): T[] => {
  const minimumUnix = getMinimumUnixForTimeframe(timeframe);
  return values.filter((value: T): boolean => {
    return compareCallback(value) >= minimumUnix;
  });
};
