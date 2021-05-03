import { useIntl } from '~/intl';
import { isPresent } from 'ts-is-present';
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';

export function useStringFormatting() {
  const { formatPercentage, formatNumber, formatDateFromSeconds } = useIntl();

  const getValueString = (value: number | null, isPercentage?: boolean) => {
    return isPresent(value)
      ? isPercentage
        ? `${formatPercentage(value)}%`
        : formatNumber(value)
      : '-';
  };

  const getRangeValueString = (
    valueA: number | null,
    valueB: number | null,
    isPercentage?: boolean
  ) => {
    return `${getValueString(valueA, isPercentage)} - ${getValueString(
      valueB,
      isPercentage
    )}`;
  };

  const getDateStringFromValue = (value: TimestampedValue) => {
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

  return {
    getValueString,
    getRangeValueString,
    getDateStringFromValue,
  };
}
