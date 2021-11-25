import { getDaysForTimeframe, TimeframeOption } from '@corona-dashboard/common';
import { takeRight } from 'lodash';

export function cutValuesFromTimeframe<T>(
  values: T[],
  timeframe: TimeframeOption
) {
  const amountOfDays = getDaysForTimeframe(timeframe);
  return takeRight(values, amountOfDays);
}
