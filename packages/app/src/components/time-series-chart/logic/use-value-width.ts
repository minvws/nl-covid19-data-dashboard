import { useMemo } from 'react';
import { SeriesConfig } from './series';
import { useFormatSeriesValue } from './use-format-series-value';
import { TimestampedValue } from '@corona-dashboard/common';

export function useValueWidth<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>,
  isPercentage: boolean | undefined
) {
  const formatSeriesValue = useFormatSeriesValue();
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
