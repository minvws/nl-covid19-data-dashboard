import { useIntl } from '~/intl';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';

/**
 * Util helper that helps render a date range either as:
 *
 * "1 tot en met 7 maart" (same month)
 *
 * or:
 *
 * "29 maart tot en met 4 april" (overlapping month)
 *
 */

export function useFormatDateRange(dateStartUnix: number, dateEndUnix: number) {
  const { formatDate } = useIntl();

  const dateFrom = createDateFromUnixTimestamp(dateStartUnix);
  const dateTo = createDateFromUnixTimestamp(dateEndUnix);

  const isSameMonth = dateFrom.getMonth() === dateTo.getMonth();

  const dateFromText = isSameMonth ? dateFrom.getDate() : formatDate(dateFrom);
  const dateToText = formatDate(dateTo);

  return [dateFromText, dateToText] as const;
}
