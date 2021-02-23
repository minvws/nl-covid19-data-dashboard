import { TimestampedValue } from '@corona-dashboard/common';

export type SeriesConfig<T extends TimestampedValue> = {
  metricProperty: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'dashed';
  areaFillOpacity?: number;
  strokeWidth?: number;
};
