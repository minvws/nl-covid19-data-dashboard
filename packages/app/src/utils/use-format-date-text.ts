import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

type DateRange = {
  start: number;
  end: number;
};

/**
 *
 * @param dateOrRange
 * @param dateOfInsertionUnix
 * @param datumsText
 */
export function useFormatDateText(datumsText?: string, dateOfInsertionUnix?: number, dateOrRange?: number | DateRange) {
  const { formatDateFromSeconds } = useIntl();

  if (datumsText !== undefined && dateOfInsertionUnix !== undefined && dateOrRange !== undefined) {
    if (typeof dateOrRange === 'number') {
      const dateOfReport = formatDateFromSeconds(dateOrRange, 'weekday-long');
      const dateOfInsertion = formatDateFromSeconds(dateOfInsertionUnix, 'weekday-long');
      return replaceVariablesInText(datumsText, {
        dateOfReport,
        dateOfInsertion,
      });
    } else {
      const weekStart = formatDateFromSeconds(dateOrRange.start, 'weekday-long');
      const weekEnd = formatDateFromSeconds(dateOrRange.end, 'weekday-long');
      const dateOfInsertion = formatDateFromSeconds(dateOfInsertionUnix, 'weekday-long');
      return replaceVariablesInText(datumsText, {
        weekStart,
        weekEnd,
        dateOfInsertion,
      });
    }
  }
}
