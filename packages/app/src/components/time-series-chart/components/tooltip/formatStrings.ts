import { useIntl } from '~/intl';
import { isPresent } from 'ts-is-present';
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useCallback } from 'react';

export function useGetValueString() {
  const { formatPercentage, formatNumber } = useIntl();

  return useCallback(
    (value: number | null, isPercentage?: boolean) => {
      return isPresent(value)
        ? isPercentage
          ? `${formatPercentage(value)}%`
          : formatNumber(value)
        : '-';
    },
    [formatPercentage, formatNumber]
  );
}

export function useGetRangeValueString() {
  const getValueStringForKey = useGetValueString();

  return useCallback(
    (valueA: number | null, valueB: number | null, isPercentage?: boolean) => {
      return `${getValueStringForKey(
        valueA,
        isPercentage
      )} - ${getValueStringForKey(valueB, isPercentage)}`;
    },
    [getValueStringForKey]
  );
}

export function useGetDateStringFromValue() {
  const { formatDateFromSeconds } = useIntl();

  return useCallback(
    (value: TimestampedValue) => {
      if (isDateValue(value)) {
        return formatDateFromSeconds(value.date_unix);
      } else if (isDateSpanValue(value)) {
        const dateStartString = formatDateFromSeconds(
          value.date_start_unix,
          'axis'
        );
        const dateEndString = formatDateFromSeconds(
          value.date_end_unix,
          'axis'
        );

        return `${dateStartString} - ${dateEndString}`;
      }
    },
    [formatDateFromSeconds]
  );
}
