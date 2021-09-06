import { Feature } from '~/types';

export const features: Feature[] = [
  {
    name: 'vaccinationPerAgeGroup',
    isEnabled: true,
    dataScopes: ['nl'],
    metricName: 'vaccine_coverage_per_age_group',
  },
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
    isEnabled: true,
  },
  {
    name: 'inPositiveTestsPage',
    isEnabled: true,
    dataScopes: ['in', 'in_collection'],
    metricName: 'tested_overall',
  },
  {
    name: 'inVariantsPage',
    isEnabled: true,
    dataScopes: ['in'],
    metricName: 'variants',
  },
  {
    name: 'nlGpSuspicionsIsHistorical',
    isEnabled: true,
  },
  {
    name: 'vrVaccinationPage',
    isEnabled: true,
    dataScopes: ['vr', 'vr_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'gmVaccinationPage',
    isEnabled: true,
    dataScopes: ['gm', 'gm_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'nlVaccinationChoropleth',
    isEnabled: true,
    dataScopes: ['gm_collection', 'vr_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'gmRankingHospital',
    isEnabled: true,
    dataScopes: ['gm'],
    metricName: 'hospital_nice_sum',
  },
  {
    name: 'gmRankingTested',
    isEnabled: true,
    dataScopes: ['gm'],
    metricName: 'tested_overall_sum',
  },
];
