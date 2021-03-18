import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { getSeriesData } from '~/components-styled/time-series-chart/logic/series';

export type BarSeriesDefinition<T extends TimestampedValue> = {
  type: 'bar';
  metricProperty: keyof T;
  label: string;
  color: string;
  secondaryColor?: string;
  style?: 'solid' | 'striped';
};

export function useSeries<T extends TimestampedValue>(
  values: T[],
  config: BarSeriesDefinition<T>
) {
  return useMemo(() => getSeriesData(values, config.metricProperty), [
    values,
    config,
  ]);
}

export function useCalculatedSeriesMaximum<T extends TimestampedValue>(
  values: T[],
  config: BarSeriesDefinition<T>
) {
  return useMemo(
    () => Math.max(...values.map((x) => x[config.metricProperty] as number)),
    [values, config]
  );
}
