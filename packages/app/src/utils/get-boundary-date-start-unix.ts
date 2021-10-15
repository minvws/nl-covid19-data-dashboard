import { isDateValue, TimestampedValue } from '@corona-dashboard/common';

/**
 * Return the start date for a timespan calculated x items from the end of a
 * range of values.
 */
export function getBoundaryDateStartUnix(
  values: TimestampedValue[],
  numberOfItems: number
): number {
  if (numberOfItems >= values.length) {
    return Infinity;
  }

  const boundaryValue = values[values.length - numberOfItems];

  return isDateValue(boundaryValue)
    ? boundaryValue.date_unix
    : boundaryValue.date_start_unix;
}
