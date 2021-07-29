import { VrCollectionSituations } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';

export type SituationsSidebarValue = {
  date_start_unix: number;
  date_end_unix: number;
};

export function getSituationsSidebarValue(
  vrSituations: VrCollectionSituations[] | undefined
) {
  if (!isDefined(vrSituations) || !vrSituations.length) {
    return null;
  }

  return {
    date_start_unix: vrSituations[0].date_start_unix,
    date_end_unix: vrSituations[0].date_end_unix,
  };
}
