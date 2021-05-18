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

export type TimespanAnnotationConfig =
  | {
      type: 'solid';
      start: number;
      end: number;
      label: string;
      shortLabel?: string;
      cutValuesForMetricProperties?: string[];
    }
  | {
      type: 'hatched';
      start: number;
      end: number;
      label: string;
      shortLabel?: string;
      cutValuesForMetricProperties?: string[];
    }
  | {
      type: 'divider';
      start: number;
      end: number;
      leftLabel: string;
      rightLabel: string;
    };
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
