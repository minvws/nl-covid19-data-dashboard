/**
 * These types are placed here to avoid a circular dependency. The nl/vr/gm
 * files import them and those files are imported from index, so placing them
 * in index would make it circular.
 */
export type MetricConfig = {
  isDecimal?: boolean;
  isPercentage?: boolean;
  barScale?: BarScaleConfig;
  riskCategoryThresholds?: { color?: string; threshold: number }[];
  choroplethThresholds?: ChoroplethThresholdsValue[];
};

type BarScaleConfig = {
  min: number;
  max: number;
  signaalwaarde: number;
  gradient: { color: string; value: number }[];
};

export type ChoroplethThresholdsValue<T extends number = number> = {
  color: string;
  threshold: T;
  label?: string;
  /**
   * Optionally define the label which explains the "end" of a threshold
   */
  endLabel?: string;
};
