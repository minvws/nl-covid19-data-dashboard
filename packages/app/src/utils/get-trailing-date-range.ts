import { isDateValue, TimestampedValue } from '@corona-dashboard/common';
import { assert } from './assert';
import { createDate } from './create-date';

type ValueWithUnixDate = {
  date_unix: number;
};

export type DateRange = [startDate: Date, endDate: Date];

/**
 * This function returns the start and end date that represents the trailing
 * count. So if the range for the last 4 dates is requested the method returns
 * the fourth to last item and the last item as its start and end
 *
 * @TODO this function can be replaced by getBoundaryDateStart/EndUnix for newer
 * charts.
 */
export function getTrailingDateRange(
  values: ValueWithUnixDate[],
  trailingCount: number
): DateRange {
  assert(values.length > 0, 'Need a value list that has at least one item');

  const startIndex =
    trailingCount < values.length ? values.length - trailingCount : 0;
  const endIndex = values.length >= 1 ? values.length - 1 : 0;

  return [
    createDate(values[startIndex].date_unix),
    createDate(values[endIndex].date_unix),
  ];
}

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

/**
 * Return the end date for a timespan calculated x items from the start of a
 * range of values.
 */
export function getBoundaryDateEndUnix(
  values: TimestampedValue[],
  numberOfItems: number
): number {
  if (numberOfItems >= values.length) {
    return 0;
  }

  const boundaryValue = values[numberOfItems];

  return isDateValue(boundaryValue)
    ? boundaryValue.date_unix
    : boundaryValue.date_end_unix;
}
