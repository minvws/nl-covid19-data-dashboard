import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { SeriesConfig } from './series';

export function useFormatSeriesValue() {
  const intl = useIntl();

  return useMemo(() => {
    const getValueString = (value: unknown, isPercentage?: boolean) => {
      const numberValue = value as number | null;
      return isPresent(numberValue)
        ? isPercentage
          ? `${intl.formatPercentage(numberValue)}%`
          : intl.formatNumber(numberValue)
        : '-';
    };

    const getRangeValueString = (
      valueA: unknown,
      valueB: unknown,
      isPercentage?: boolean
    ) => {
      return `${getValueString(valueA, isPercentage)} - ${getValueString(
        valueB,
        isPercentage
      )}`;
    };

    function formatSeriesValue<T extends TimestampedValue>(
      value: T,
      config: SeriesConfig<T>[number],
      isPercentage?: boolean
    ) {
      switch (config.type) {
        case 'range':
          return getRangeValueString(
            value[config.metricPropertyLow],
            value[config.metricPropertyHigh],
            isPercentage
          );
        default:
          return getValueString(value[config.metricProperty], isPercentage);
      }
    }

    return formatSeriesValue;
  }, [intl]);
}
