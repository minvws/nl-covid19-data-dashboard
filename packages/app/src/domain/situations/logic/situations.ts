import { useMemo } from 'react';
import { SiteText } from '~/locale';

export type SituationTexts =
  SiteText['pages']['contactTracing']['shared']['situaties'];
export type SituationKey = keyof SituationTexts;

interface Situation {
  id: SituationKey;
  title: string;
  description: string;
}

const situations: SituationKey[] = [
  'home_and_visits',
  'work',
  'school_and_day_care',
  'health_care',
  'gathering',
  'travel',
  'hospitality',
  'other',
];

export function useSituations(situationTexts: SituationTexts) {
  return useMemo(
    () =>
      situations.map<Situation>((id) => ({
        id,
        title: situationTexts[id].titel,
        description: situationTexts[id].beschrijving,
      })),
    [situationTexts]
  );
}
