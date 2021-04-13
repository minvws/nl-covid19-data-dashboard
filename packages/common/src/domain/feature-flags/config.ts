import { FeatureDefinition } from './types';

/**
 * This list is to strongly type feature names so that we can have an easy
 * overview of features and not misspell the names.
 */
export type FeatureName = 'vaccineStockPerSupplier' | 'someOtherFeature';

export const features: FeatureDefinition<FeatureName>[] = [
  {
    name: 'vaccineStockPerSupplier',
    isEnabled: false,
    metricNames: ['vaccine_stock'],
  },
];
