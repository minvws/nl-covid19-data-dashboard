export interface DataOptions {
  valueAnnotation?: string;
  forcedMaximumValue?: number;
  isPercentage?: boolean;
  benchmark?: BenchmarkConfig;
  timespanAnnotations?: TimespanAnnotationConfig[];
}

export interface BenchmarkConfig {
  value: number;
  label?: string;
}

export interface TimespanAnnotationConfig {
  start: number;
  end: number;
  label: string;
  shortLabel?: string;
  cutValuesForMetricProperties?: string[];
}

/**
 * @TODO find a more common place for this.
 */
export type Padding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type Bounds = { width: number; height: number };
