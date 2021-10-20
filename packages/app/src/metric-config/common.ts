/**
 * These types are placed here to avoid a circular dependency. The nl/vr/gm
 * files import them and those files are imported from index, so placing them
 * in index would make it circular.
 */
export type MetricConfig = {
  barScale?: BarScaleConfig;
};

export type BarScaleConfig = {
  min: number;
  max: number;
  limit: number;
  gradient: { color: string; value: number }[];
};
