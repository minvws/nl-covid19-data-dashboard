import { TimelineEventConfig } from '../components/timeline';

/**
 * The prop renderNullAsZero only make sense when rendering a gapped-stacked-area,
 * hence why it only works in that particular config .
 */
export interface DataOptions {
  valueAnnotation?: string;
  forcedMaximumValue?: number | ((x: number) => number);
  isPercentage?: boolean;
  benchmark?: BenchmarkConfig;
  timespanAnnotations?: TimespanAnnotationConfig[];
  timeAnnotations?: TimeAnnotationConfig[];
  timelineEvents?: TimelineEventConfig[];
  renderNullAsZero?: boolean;
}

export interface BenchmarkConfig {
  value: number;
  label?: string;
}

export type TimespanAnnotationConfig = {
  fill?: 'solid' | 'hatched' | 'dotted' | 'none';
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
