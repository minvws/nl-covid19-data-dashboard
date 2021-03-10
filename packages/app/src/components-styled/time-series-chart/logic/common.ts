import { TimestampedValue } from '@corona-dashboard/common';
import {
  AreaSeriesDefinition,
  LineSeriesDefinition,
  RangeSeriesDefinition,
  SeriesConfigTypes,
} from './series';

export function isLineOrAreaDefinition<T extends TimestampedValue>(
  config: SeriesConfigTypes<T>
): config is LineSeriesDefinition<T> | AreaSeriesDefinition<T> {
  return config.type == 'line' || config.type == 'area';
}

export function isRangeDefinition<T extends TimestampedValue>(
  config: SeriesConfigTypes<T>
): config is RangeSeriesDefinition<T> {
  return config.type == 'range';
}

export interface DataOptions {
  valueAnnotation?: string;
  forcedMaximumValue?: number;
  isPercentage?: boolean;
  benchmark?: {
    value: number;
    label: string;
  };
  timespanAnnotations?: TimespanAnnotationConfig[];
  hideLegend?: boolean;
  showOnlyNearestPoint?: boolean;
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
