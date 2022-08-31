import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { SeriesConfig } from './series';
import { MetricPropertyFormatters } from './use-metric-property-formatters';

export function useFormatSeriesValue<T extends TimestampedValue>(
  metricPropertyFormatters: MetricPropertyFormatters<T>
) {
  const intl = useIntl();

  return useMemo(() => {
    function getValueString(
      value: T,
      metricProperty: keyof T,
      isPercentage?: boolean
    ) {
      const formatter =
        metricPropertyFormatters[metricProperty] || intl.formatNumber;
      const numberValue = value[metricProperty];
      if (!isPresent(numberValue)) return '-';

      const formattedValue =
        isPresent(numberValue) && typeof numberValue === 'number'
          ? formatter(numberValue)
          : String(numberValue);

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
  }, [metricPropertyFormatters, intl.formatNumber]);
}
