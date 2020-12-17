/**
 * These types are placed here to avoid a circular dependency. The nl/vr/gm
 * files import them and those files are imported from index, so placing them
 * in index would make it circular.
 */
export type MetricConfig = {
  isDecimal?: boolean;
  isPercentage?: boolean;
  isWeeklyData?: boolean;
  barScale?: BarScaleConfig;
};

export type BarScaleConfig = {
  min: number;
  max: number;
  signaalwaarde: number;
  gradient: { color: string; value: number }[];
  rangesKey: string;
};

/**
 * This is currently only used to facilitate behavior, where we do show metric
 * data in the sidebar, but nothing specific to a metric property.
 */
export const NO_METRIC_PROPERTY = '__no_metric_property';
