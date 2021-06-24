import { midOfDayInSeconds } from '@corona-dashboard/common';
import { first, last } from 'lodash';
import { TimelineEventConfig } from './common';

export function isVisibleEvent(config: TimelineEventConfig, domain: number[]) {
  const min = first(domain) as number;
  const max = last(domain) as number;

  const [start, end] = Array.isArray(config.date)
    ? [midOfDayInSeconds(config.date[0]), midOfDayInSeconds(config.date[1])]
    : [midOfDayInSeconds(config.date), midOfDayInSeconds(config.date)];

  if (end < start) {
    console.warn(
      'cannot display timeline event with end date before start date:',
      JSON.stringify(config, null, 2)
    );
    return false;
  }

  return min <= end && start <= max;
}
