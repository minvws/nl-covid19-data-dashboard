import { Feature } from '@corona-dashboard/common';

export const features: Feature[] = [
  {
    name: 'downscaling',
    isEnabled: false,
    route: '/afschaling',
  },
  {
    name: 'vaccineStockPerSupplier',
    isEnabled: true,
    metricScopes: ['nl'],
    metricName: 'vaccine_stock',
    metricProperties: ['astra_zeneca_total', 'astra_zeneca_available'],
  },
  {
    name: 'vaccinationPerAgegroup',
    isEnabled: false,
    metricScopes: ['nl'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'hospitalMovingAverage',
    isEnabled: true,
  },
  {
    name: 'intensiveCareMovingAverage',
    isEnabled: true,
  },
];
