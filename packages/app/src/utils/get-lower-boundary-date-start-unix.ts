import { isDateValue, TimestampedValue } from '@corona-dashboard/common';

/**
 * Return the start date for a time span calculated x items from the start of a
 * range of values.
 */
export function getLowerBoundaryDateStartUnix(
  values: TimestampedValue[],
  numberOfItems: number
): number {
  if (numberOfItems >= values.length) {
    return Infinity;
  }

  const boundaryValue = values[numberOfItems];

  return isDateValue(boundaryValue)
    ? boundaryValue.date_unix
    : boundaryValue.date_start_unix;
}
