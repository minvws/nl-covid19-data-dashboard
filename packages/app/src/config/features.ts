import { Feature } from '@corona-dashboard/common';

export const features: Feature[] = [
  {
    name: 'vaccinationPerAgeGroup',
    isEnabled: false,
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
];
