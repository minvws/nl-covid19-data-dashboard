import { FeatureDefinition } from './types';

/**
 * This list is to strongly type feature names so that we can have an easy
 * overview of features and not misspell the names.
 */
export type FeatureName = 'vaccineStockPerSupplier' | 'someOtherFeature';

export type Features = FeatureDefinition<FeatureName>[];

export const features: Features = [
  {
    name: 'vaccineStockPerSupplier',
    isEnabled: true,
    metricScopes: ['nl'],
    metricName: 'vaccine_stock',
    metricProperties: ['astra_zeneca_total', 'astra_zeneca_available'],
  },
];
