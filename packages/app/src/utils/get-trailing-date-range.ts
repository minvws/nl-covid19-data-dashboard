import { assert } from './assert';
import { createDate } from './createDate';

type ValueWithUnixDate = {
  date_unix: number;
};

export type DateRange = [startDate: Date, endDate: Date];

/**
 * This function returns the start and end date that represents the trailing count.
 * So if the range for the last 4 dates is requested the method returns the fourth to last item
 * and the last item as its start and end
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
