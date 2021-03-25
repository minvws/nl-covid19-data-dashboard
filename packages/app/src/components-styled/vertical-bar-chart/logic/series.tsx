import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { pick } from 'lodash';
import { isPresent } from 'ts-is-present';
import {
  getSeriesData,
  SeriesSingleValue,
} from '~/components-styled/time-series-chart/logic/series';

export type BarSeriesConfig<
  T extends TimestampedValue
> = BarSeriesDefinition<T>[];

export type BarSeriesDefinition<T extends TimestampedValue> = {
  type: 'bar';
  metricProperty: keyof T;
  label: string;
  color: string;
  secondaryColor?: string;
  style?: 'solid' | 'striped';
};

export function useSeriesList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: BarSeriesConfig<T>
) {
  return useMemo(() => getSeriesList(values, seriesConfig), [
    values,
    seriesConfig,
  ]);
}

export type BarSeriesList = SeriesSingleValue[][];

export function getSeriesList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: BarSeriesConfig<T>
): BarSeriesList {
  return seriesConfig.map((config) =>
    getSeriesData(values, config.metricProperty)
  );
}

export function useCalculatedSeriesMaximum<T extends TimestampedValue>(
  values: T[],
  seriesConfig: BarSeriesConfig<T>
) {
  return useMemo(() => calculateSeriesMaximum(values, seriesConfig), [
    values,
    seriesConfig,
  ]);
}

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis. We need to do this for each of the keys that are used to
 * render lines, so that the axis scales with whatever key contains the highest
 * values.
 */
export function calculateSeriesMaximum<T extends TimestampedValue>(
  values: T[],
  seriesConfig: BarSeriesConfig<T>
) {
  const metricProperties = seriesConfig.flatMap((x) => x.metricProperty);

  const peakValues = values.map((x) => {
    const trendValues = Object.values(pick(x, metricProperties)) as (
      | number
      | null
    )[];
    return Math.max(...trendValues.filter(isPresent));
  });

  return Math.max(...peakValues);
}
