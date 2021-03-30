import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { pick } from 'lodash';
import { isPresent } from 'ts-is-present';
import { SeriesSingleValue } from '~/components-styled/time-series-chart/logic/series';

export type SeriesConfig<T extends TimestampedValue> = BarSeriesDefinition<T>[];

export type BarSeriesDefinition<T extends TimestampedValue> = {
  type: 'bar';
  metricProperty: keyof T;
  color: string;
  secondaryColor?: string;
};

export function useSeriesList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>
) {
  return useMemo(() => getSeriesList(values, seriesConfig), [
    values,
    seriesConfig,
  ]);
}

export type SeriesList = SeriesSingleValue[][];

export function getSeriesList<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>
): SeriesList {
  return seriesConfig.map((config) =>
    getSeriesData(values, config.metricProperty)
  );
}

/**
 * This function is almost exactly like getSeriesData from TimeSeriesChart
 * except it uses the date_end_unix as the date __date_unix in a date span
 */
export function getSeriesData<T extends TimestampedValue>(
  values: T[],
  metricProperty: keyof T
): SeriesSingleValue[] {
  if (values.length === 0) {
    return [];
  }

  if (isDateSeries(values)) {
    return values.map((x) => ({
      __value: (x[metricProperty] ?? undefined) as number | undefined,
      // @ts-expect-error @TODO figure out why the type guard doesn't work
      __date_unix: x.date_unix,
    }));
  }

  if (isDateSpanSeries(values)) {
    return values.map((x) => ({
      __value: (x[metricProperty] ?? undefined) as number | undefined,
      // @ts-expect-error @TODO figure out why the type guard doesn't work
      __date_unix: x.date_end_unix,
    }));
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}

export function useCalculatedSeriesExtremes<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>
) {
  return useMemo(() => calculateSeriesExtremes(values, seriesConfig), [
    values,
    seriesConfig,
  ]);
}

/**
 * From all the defined values, extract the highest and lowest number so we know how to
 * scale the y-axis. We need to do this for each of the keys that are used to
 * render lines, so that the axis scales with whatever key contains the highest
 * and lowest values.
 */
export function calculateSeriesExtremes<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>
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
