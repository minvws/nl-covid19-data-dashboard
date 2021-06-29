import { middleOfDayInSeconds } from '@corona-dashboard/common';
import { first, last } from 'lodash';
import { TimelineEventConfig } from './common';

export function isVisibleEvent(config: TimelineEventConfig, domain: number[]) {
  const min = first(domain) as number;
  const max = last(domain) as number;

  const [x0, x1] = [
    middleOfDayInSeconds(config.start),
    middleOfDayInSeconds(config.end || config.start),
  ];

  if (x1 < x0) {
    console.warn(
      'cannot display timeline event with end date before start date:',
      JSON.stringify(config, null, 2)
    );
    return false;
  }

  return min <= x1 && x0 <= max;
}
