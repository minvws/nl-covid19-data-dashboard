import { getDaysForTimeframe, TimeframeOption } from '@corona-dashboard/common';
import { takeRight } from 'lodash';

/**
 * Removes all of the items from the given values array that are not within the given timeframe.
 * It is assumed that the given values array is sorted by date, with the oldest date first.
 */
export function cutValuesFromTimeframe<T>(
  values: T[],
  timeframe: TimeframeOption
) {
  const amountOfDays = getDaysForTimeframe(timeframe);
  return takeRight(values, amountOfDays);
}
