import { Feature } from '~/types';

export const features: Feature[] = [
  {
    name: 'nlVaccinationBoosterShotsPerAgeGroup',
    isEnabled: false,
    metricName: 'vaccine_coverage_per_age_group',
    metricProperties: ['booster_shot_percentage_label', 'booster_shot_percentage'],
  },
];
