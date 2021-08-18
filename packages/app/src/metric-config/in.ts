import { MetricKeys, In } from '@corona-dashboard/common';
import { MetricConfig } from './common';
import { positiveTestedThresholds } from './choropleth-thresholds';

type InMetricKey = MetricKeys<In>;
type InConfig = Partial<Record<InMetricKey, Record<string, MetricConfig>>>;

// NOTE: cannot use in because it is a keyword
export const inConfig: InConfig = {
  tested_overall: {
    infected_per_100k_average: {
      choroplethThresholds: positiveTestedThresholds,
    },
  },
};
