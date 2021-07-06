import { Feature } from '@corona-dashboard/common';

export const features: Feature[] = [
  {
    name: 'vaccinationPerAgegroup',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'sewerSplitAreaChart',
    isEnabled: true,
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
];
