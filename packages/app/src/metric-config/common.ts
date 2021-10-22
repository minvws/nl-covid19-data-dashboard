import { Gm, MetricKeys, Nl, Vr } from '@corona-dashboard/common';

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

type MetricConfig = {
  barScale?: BarScaleConfig;
};

type ValueMetric<T> = {
  values: T[];
  last_value: T;
};

/**
 * This makes sure the object containing the metric configs follows the same
 * structure as the data object it is coupled with
 */
export type ScopedMetricConfigs<S extends Nl | Vr | Gm> = {
  [key in MetricKeys<S>]?: S[key] extends ValueMetric<infer T>
    ? {
        [metricKey in keyof T]?: MetricConfig;
      }
    : {
        [metricKey in keyof S[key]]?: MetricConfig;
      };
};
