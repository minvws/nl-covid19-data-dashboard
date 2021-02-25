import { TimestampedValue } from '@corona-dashboard/common';

export type SeriesConfig<T extends TimestampedValue> = (
  | LineDefinition<T>
  | AreaDefinition<T>
  // | RangeDefinition<T>
)[];

export type LineDefinition<T extends TimestampedValue> = {
  type: 'line';
  metricProperty: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
};

export type RangeDefinition<T extends TimestampedValue> = {
  type: 'range';
  metricPropertyLow: keyof T;
  metricPropertyHigh: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'dashed';
  fillOpacity?: number;
  strokeWidth?: number;
};

export type AreaDefinition<T extends TimestampedValue> = {
  type: 'area';
  metricProperty: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'striped';
  fillOpacity?: number;
  strokeWidth?: number;
};
