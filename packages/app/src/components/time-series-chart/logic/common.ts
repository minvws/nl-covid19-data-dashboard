import { TimelineEventConfig } from '../components/timeline';

/**
 * The prop setNullToZero only make sense when rendering a gapped-stacked-area, hence why it only works there.
 */
export interface DataOptions {
  valueAnnotation?: string;
  forcedMaximumValue?: number | ((x: number) => number);
  isPercentage?: boolean;
  benchmark?: BenchmarkConfig;
  timespanAnnotations?: TimespanAnnotationConfig[];
  timeAnnotations?: TimeAnnotationConfig[];
  timelineEvents?: TimelineEventConfig[];
  setNullToZero?: boolean;
}

export interface BenchmarkConfig {
  value: number;
  label?: string;
}

export type TimespanAnnotationConfig = {
  fill?: 'solid' | 'hatched' | 'dotted';
  start: number;
  end: number;
  label: string;
  shortLabel?: string;
  cutValuesForMetricProperties?: string[];
};

export type TimeAnnotationConfig = {
  type: 'divider';
  position: number;
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
