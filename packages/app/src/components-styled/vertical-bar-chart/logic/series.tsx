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

export function useCalculatedSeriesExtremes<T extends TimestampedValue>(
  values: T[],
  seriesConfig: BarSeriesConfig<T>
) {
  return useMemo(() => calculateSeriesExtremes(values, seriesConfig), [
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
export function calculateSeriesExtremes<T extends TimestampedValue>(
  values: T[],
  seriesConfig: BarSeriesConfig<T>
) {
  const metricProperties = seriesConfig.flatMap((x) => x.metricProperty);

  const extremeValues = values
    .map((x) => {
      const trendValues = Object.values(pick(x, metricProperties)) as (
        | number
        | null
      )[];
      const presentValues = trendValues.filter(isPresent);
      return [Math.min(...presentValues), Math.max(...presentValues)];
    })
    .flat();

  return {
    max: Math.max(...extremeValues),
    min: Math.min(...extremeValues),
  };
}
