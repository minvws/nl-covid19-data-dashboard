import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { SeriesConfig } from './series';

export function useFormatSeriesValue<T extends TimestampedValue>(
  formatters: Record<keyof T, (value: number) => string>
) {
  const intl = useIntl();

  return useMemo(() => {
    function getValueString(
      value: T,
      metricProperty: keyof T,
      isPercentage?: boolean
    ) {
      const formatter = formatters[metricProperty] || intl.formatNumber;
      const numberValue = value[metricProperty] as unknown as number | null;
      const formattedValue = isPresent(numberValue)
        ? formatter(numberValue)
        : numberValue;

      return isPresent(formattedValue)
        ? isPercentage
          ? `${formattedValue}%`
          : formattedValue
        : '-';
    }

    function formatSeriesValue(
      value: T,
      config: SeriesConfig<T>[number],
      isPercentage?: boolean
    ) {
      switch (config.type) {
        case 'range':
          return `${getValueString(
            value,
            config.metricPropertyLow,
            isPercentage
          )} - ${getValueString(
            value,
            config.metricPropertyHigh,
            isPercentage
          )}`;
        default:
          return getValueString(value, config.metricProperty, isPercentage);
      }
    }

    return formatSeriesValue;
  }, [formatters, intl.formatNumber]);
}
