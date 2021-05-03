import { useIntl } from '~/intl';
import { isPresent } from 'ts-is-present';
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';

export function useGetValueString() {
  const { formatPercentage, formatNumber } = useIntl();

  return (value: number | null, isPercentage?: boolean) => {
    return isPresent(value)
      ? isPercentage
        ? `${formatPercentage(value)}%`
        : formatNumber(value)
      : '-';
  };
}

export function useGetRangeValueString() {
  const getValueString = useGetValueString();

  return (
    valueA: number | null,
    valueB: number | null,
    isPercentage?: boolean
  ) => {
    return `${getValueString(valueA, isPercentage)} - ${getValueString(
      valueB,
      isPercentage
    )}`;
  };
}

export function useGetDateStringFromValue() {
  const { formatDateFromSeconds } = useIntl();

  return (value: TimestampedValue) => {
    if (isDateValue(value)) {
      return formatDateFromSeconds(value.date_unix);
    } else if (isDateSpanValue(value)) {
      const dateStartString = formatDateFromSeconds(
        value.date_start_unix,
        'axis'
      );
      const dateEndString = formatDateFromSeconds(value.date_end_unix, 'axis');

      return `${dateStartString} - ${dateEndString}`;
    }
  };
}
