import { TimeframeOption } from '.';

const getDaysForTimeframe = (timeframe: TimeframeOption): number => {
  if (timeframe === 'week') {
    return 8;
  }
  if (timeframe === 'month') {
    return 32;
  }
  return Infinity;
};

const getMinimumUnixForTimeframe = (timeframe: TimeframeOption): number => {
  const days = getDaysForTimeframe(timeframe);
  const oneDay = 24 * 60 * 60 * 1000;
  return new Date().getTime() - days * oneDay;
};

type CompareCallbackFunction<T> = (value: T) => number;

/**
 * Filter arrays of any provided types based on the timeframe.
 * Uses a callcack to retrieve the unix time zone to compare with.
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
