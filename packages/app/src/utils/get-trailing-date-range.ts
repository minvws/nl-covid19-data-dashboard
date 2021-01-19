import { assert } from './assert';
import { createDate } from './createDate';

type ValueWithUnixDate = {
  date_unix: number;
};

export type DateRange = [startDate: Date, endDate: Date];

export function getTrailingDateRange(
  values: ValueWithUnixDate[],
  dayCount: number
): DateRange {
  assert(values.length > 0, 'Need a value list that has at least one item');

  const startIndex = dayCount < values.length ? values.length - dayCount : 0;
  const endIndex = values.length >= 1 ? values.length - 1 : 0;

  return [
    createDate(values[startIndex].date_unix),
    createDate(values[endIndex].date_unix),
  ];
}
