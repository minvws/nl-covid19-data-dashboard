import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { formatStyle } from '@corona-dashboard/common';

type DateRange = {
  start: number;
  end: number;
};

/**
 * Inserts formatted dates into a specified text string based on provided date inputs.
 * @export
 * @param {Function} formatter - A function for formatting date. It accepts a Unix timestamp and an optional formatting style, and returns a formatted string.
 * @param {string} datumsText - The text string into which the formatted dates will be inserted.
 * @param {number} dateOfInsertionUnix - Unix timestamp representing the date of insertion.
 * @param {(number | DateRange)} dateOfReport - Unix timestamp representing the date of report, or a DateRange object containing start and end dates for a report period.
 * @param {formatStyle} [style] - Optional formatting style to be used by the formatter function. If not provided, 'weekday-long' will be used as the default style.
 * @returns {string} - A text string with inserted dates. If 'dateOfReport' is a number, it inserts 'dateOfReporting' and 'dateOfInsertion' into the text. If 'dateOfReport' is a DateRange object, it inserts 'weekStart', 'weekEnd', and 'dateOfInsertion' into the text.
 */
export function insertDateIntoString(
  formatter: (date: number, style?: formatStyle) => string,
  datumsText: string,
  dateOfInsertionUnix: number,
  dateOfReport: number | DateRange,
  style?: formatStyle
) {
  if (typeof dateOfReport === 'number') {
    const dateOfReporting = formatter(dateOfReport, style ? style : 'weekday-long');
    const dateOfInsertion = formatter(dateOfInsertionUnix, style ? style : 'weekday-long');
    return replaceVariablesInText(datumsText, {
      dateOfReporting,
      dateOfInsertion,
    });
  } else {
    const weekStart = formatter(dateOfReport.start, style ? style : 'weekday-long');
    const weekEnd = formatter(dateOfReport.end, style ? style : 'weekday-long');
    const dateOfInsertion = formatter(dateOfInsertionUnix, style ? style : 'weekday-long');
    return replaceVariablesInText(datumsText, {
      weekStart,
      weekEnd,
      dateOfInsertion,
    });
  }
}
