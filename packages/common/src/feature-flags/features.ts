import { Feature } from '~/types';

export const features: Feature[] = [
  {
    name: 'situationsPage',
    isEnabled: true,
    dataScopes: ['vr', 'vr_collection'],
    metricName: 'situations',
  },
  {
    name: 'nlVariantsPage',
    isEnabled: true,
    dataScopes: ['nl'],
    metricName: 'variants',
  },
  {
    name: 'inHomePage',
    isEnabled: false,
  },
  {
    name: 'inPositiveTestsPage',
    isEnabled: false,
    dataScopes: ['in', 'in_collection'],
    metricName: 'tested_overall',
  },
  {
    name: 'inVariantsPage',
    isEnabled: false,
    dataScopes: ['in'],
    metricName: 'variants',
  },
  {
    name: 'nlGpSuspicionsIsHistorical',
    isEnabled: true,
  },
  {
    name: 'vrVaccinationPage',
    isEnabled: false,
    dataScopes: ['vr', 'vr_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'gmVaccinationPage',
    isEnabled: false,
    dataScopes: ['gm', 'gm_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'nlVaccinationChoropleth',
    isEnabled: false,
    dataScopes: ['gm_collection', 'vr_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'gmRankingHospital',
    isEnabled: false,
    dataScopes: ['gm'],
    metricName: 'hospital_nice_sum',
  },
  {
    name: 'gmRankingTested',
    isEnabled: false,
    dataScopes: ['gm'],
    metricName: 'tested_overall_sum',
  },
];
