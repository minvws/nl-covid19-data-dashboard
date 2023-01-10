import { DataScope, MetricKeys, MetricProperty } from '@corona-dashboard/common';

/**
 * These types are placed here to avoid a circular dependency. The nl/vr/gm
 * files import them and those files are imported from index, so placing them
 * in index would make it circular.
 */

export type BarScaleConfig = {
  min: number;
  max: number;
  limit: number;
  gradient: { color: string; value: number }[];
};

export type MetricConfig = {
  barScale?: BarScaleConfig;
};

/**
 * This makes sure the object containing the metric configs follows the same
 * structure as the data object it is coupled with
 */
export type ScopedMetricConfigs<S extends DataScope> = {
  [metricKey in MetricKeys<S>]?: {
    [property in MetricProperty<S, metricKey>]?: MetricConfig;
  };
};
