import {
  DAY_IN_SECONDS,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';

/**
 * Return the start date for a time span calculated x items from the end of a
 * range of values.
 */
export function getBoundaryDateStartUnix(
  values: TimestampedValue[],
  numberOfItems: number
) {
  if (numberOfItems >= values.length) {
    return Infinity;
  }

  const boundaryValue = values[values.length - numberOfItems];

  return (
    (isDateValue(boundaryValue)
      ? boundaryValue.date_unix
      : boundaryValue.date_start_unix) -
    DAY_IN_SECONDS / 2
  );
}
