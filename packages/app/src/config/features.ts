import { Feature } from '@corona-dashboard/common';

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
    name: 'variantsPage',
    isEnabled: true,
    metricName: 'variants',
  },
  {
    name: 'timelineMockData',
    isEnabled: false,
  },
  {
    name: 'internationalPage',
    isEnabled: true,
    dataScopes: ['in', 'in_collection'],
    metricName: 'tested_overall',
  },
];
