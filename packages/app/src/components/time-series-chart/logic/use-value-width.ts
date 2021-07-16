import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { SeriesConfig } from './series';
import { useFormatSeriesValue } from './use-format-series-value';
import { MetricPropertyFormatters } from './use-metric-property-formatters';

export function useValueWidth<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>,
  isPercentage: boolean | undefined,
  metricPropertyFormatters: MetricPropertyFormatters<T>
) {
  const formatSeriesValue = useFormatSeriesValue(metricPropertyFormatters);
  const valueMaxWidth = useMemo(() => {
    const valueLengths: number[] = [];
    seriesConfig.forEach((config) => {
      return valueLengths.push(
        Math.max(
          ...values.map(
            (value) => formatSeriesValue(value, config, isPercentage).length
          )
        )
      );
    });

    return `${Math.max(...valueLengths)}ch`;
  }, [values, seriesConfig, formatSeriesValue, isPercentage]);

  return valueMaxWidth;
}
