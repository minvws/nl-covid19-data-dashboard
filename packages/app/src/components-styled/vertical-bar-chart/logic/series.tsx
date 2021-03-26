import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { pick } from 'lodash';
import { isPresent } from 'ts-is-present';
import { SeriesSingleValue } from '~/components-styled/time-series-chart/logic/series';

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

/**
 * This function is almost exactly like getSeriesData from TimeSeriesChart
 * except it uses the date_end_unix as the date __date_unix in a date span
 */
export function getSeriesData<T extends TimestampedValue>(
  values: T[],
  metricProperty: keyof T
): SeriesSingleValue[] {
  if (values.length === 0) {
    /**
     * It could happen that you are using an old dataset and select last week as
     * a timeframe at which point the values will be empty. This would not
     * happen on production, but for development we can just render nothing.
     */
    return [];
  }

  if (isDateSeries(values)) {
    return values.map((x) => ({
      /**
       * This is messy and could be improved.
       */
      __value: (x[metricProperty] ?? undefined) as number | undefined,
      // @ts-expect-error @TODO figure out why the type guard doesn't work
      __date_unix: x.date_unix,
    }));
  }

  if (isDateSpanSeries(values)) {
    return values.map((x) => ({
      /**
       * This is messy and could be improved.
       */
      __value: (x[metricProperty] ?? undefined) as number | undefined,
      // @ts-expect-error @TODO figure out why the type guard doesn't work
      __date_unix: x.date_end_unix,
    }));
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
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
