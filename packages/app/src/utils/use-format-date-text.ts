import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

type DateRange = {
  start: number;
  end: number;
};

/**
 * @function
 * @name useFormatDateText
 * @export
 * @param {string} [datumsText] - The text into which date values will be inserted.
 * @param {number} [dateOfInsertionUnix] - The Unix timestamp of the insertion date.
 * @param {(number|DateRange)} [dateOrRange] - The Unix timestamp of the report date or a DateRange object containing the start and end dates for a week.
 * @returns {string} The original text with date values inserted at the corresponding placeholders.
 * @description This function uses the internationalization hook to format dates and insert them into a provided text. It handles undefined parameters and can process either a single date or a date range.
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
