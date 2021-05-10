import { useIntl } from '~/intl';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { SeriesConfig } from './series';
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';

export function useStringFormatting() {
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
        case 'line':
        case 'area':
        case 'bar':
        case 'stacked-area':
        case 'invisible':
          return getValueString(value[config.metricProperty], isPercentage);
        case 'range':
          return getRangeValueString(
            value[config.metricPropertyLow],
            value[config.metricPropertyHigh],
            isPercentage
          );
      }
    }

    const getDateStringFromValue = (value: TimestampedValue) => {
      if (isDateValue(value)) {
        return intl.formatDateFromSeconds(value.date_unix);
      } else if (isDateSpanValue(value)) {
        const dateStartString = intl.formatDateFromSeconds(
          value.date_start_unix,
          'axis'
        );
        const dateEndString = intl.formatDateFromSeconds(
          value.date_end_unix,
          'axis'
        );

        return `${dateStartString} - ${dateEndString}`;
      }
    };

    return {
      getDateStringFromValue,
      formatSeriesValue,
    };
  }, [intl]);
}
