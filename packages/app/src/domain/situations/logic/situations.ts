import { useMemo } from 'react';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';

export type SituationKey = keyof SiteText['brononderzoek']['situaties'];

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

export function useSituations() {
  const siteText = useIntl().siteText;

  return useMemo(
    () =>
      situations.map<Situation>((id) => ({
        id,
        title: siteText.brononderzoek.situaties[id].titel,
        description: siteText.brononderzoek.situaties[id].beschrijving,
      })),
    [siteText]
  );
}
