import { SiteText } from '~/locale';

export type SituationKey = keyof SiteText['brononderzoek']['situaties'];

export const situations: SituationKey[] = [
  'home_and_visits',
  'work',
  'school_and_day_care',
  'health_care',
  'gathering',
  'travel',
  'hospitality',
  'other',
];
