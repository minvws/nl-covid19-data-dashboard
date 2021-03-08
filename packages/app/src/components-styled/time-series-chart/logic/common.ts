export interface DataOptions {
  valueAnnotation?: string;
  forcedMaximumValue?: number;
  isPercentage?: boolean;
  benchmark?: {
    value: number;
    label: string;
  };
  timespanAnnotations?: TimespanAnnotationConfig[];
}

export interface TimespanAnnotationConfig {
  start: number;
  end: number;
  color?: string;
  label: string;
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
