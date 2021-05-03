import { useMemo } from 'react';
import { SeriesConfig } from './series';
import { useStringFormatting } from './use-string-formatting';
import { TimestampedValue } from '@corona-dashboard/common';

export function useValueWidth<T extends TimestampedValue>(
  seriesConfig: SeriesConfig<T>,
  values: T[],
  isPercentage: boolean | undefined
) {
  const { getValueString, getRangeValueString } = useStringFormatting();
  const valueMaxWidth = useMemo(() => {
    const valueLengths: number[] = [];
    seriesConfig.forEach((config) => {
      return valueLengths.push(
        ...values.map((value) => {
          switch (config.type) {
            case 'line':
            case 'area':
            case 'bar':
            case 'stacked-area':
            case 'invisible':
              return getValueString(
                (value[config.metricProperty] as unknown) as number | null,
                isPercentage
              ).length;
            case 'range':
              return getRangeValueString(
                (value[config.metricPropertyLow] as unknown) as number | null,
                (value[config.metricPropertyHigh] as unknown) as number | null,
                isPercentage
              ).length;
          }
        })
      );
    });

    return `${Math.max(...valueLengths)}ch`;
  }, [values, seriesConfig, getValueString, getRangeValueString, isPercentage]);

  return valueMaxWidth;
}
