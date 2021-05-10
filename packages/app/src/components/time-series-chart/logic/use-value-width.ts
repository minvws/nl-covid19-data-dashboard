import { useMemo } from 'react';
import { SeriesConfig } from './series';
import { useStringFormatting } from './use-string-formatting';
import { TimestampedValue } from '@corona-dashboard/common';

export function useValueWidth<T extends TimestampedValue>(
  values: T[],
  seriesConfig: SeriesConfig<T>,
  isPercentage: boolean | undefined
) {
  const { formatSeriesValue } = useStringFormatting();
  const valueMaxWidth = useMemo(() => {
    const valueLengths: number[] = [];
    seriesConfig.forEach((config) => {
      return valueLengths.push(
        ...values.map(
          (value) => formatSeriesValue(value, config, isPercentage).length
        )
      );
    });

    return `${Math.max(...valueLengths)}ch`;
  }, [values, seriesConfig, formatSeriesValue, isPercentage]);

  return valueMaxWidth;
}
