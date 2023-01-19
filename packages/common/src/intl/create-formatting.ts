import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';
import subDays from 'date-fns/subDays';
import { isDefined } from 'ts-is-present';
import { assert } from '../utils';
// TypeScript is missing some types for `Intl.DateTimeFormat`.
// https://github.com/microsoft/TypeScript/issues/35865
export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

export type formatStyle = 'time' | 'long' | 'medium' | 'iso' | 'axis' | 'axis-with-year' | 'weekday-medium' | 'weekday-long' | 'day-month';

// Helper functions

function isDayBeforeYesterday(date: Date, compareDate: Date) {
  return isSameDay(date, subDays(compareDate, 2));
}

type DateDefinition = Date | { seconds: number } | { milliseconds: number };

/**
 * Utility to create a Date from seconds or milliseconds
 * eg:
 *
 *     getDate({      seconds: 1616066567 })
 *     getDate({ milliseconds: 1616066567880 })
 */
function parseDateDefinition(dateDefinition: DateDefinition) {
  if (dateDefinition instanceof Date) {
    return dateDefinition;
  }

  if ('seconds' in dateDefinition && isDefined(dateDefinition.seconds)) {
    return new Date(dateDefinition.seconds * 1000);
  }

  if ('milliseconds' in dateDefinition && isDefined(dateDefinition.milliseconds)) {
    return new Date(dateDefinition.milliseconds);
  }

  throw new Error(`Unknown date input: ${JSON.stringify(dateDefinition)}`);
}

export type DataFormatters = ReturnType<typeof createFormatting>;

export function createFormatting(
  languageTag: string,
  text: {
    date_today: string;
    date_yesterday: string;
    date_day_before_yesterday: string;
  }
) {
  function formatNumber(value: number | string | undefined | null, numFractionDigits?: number): string {
    if (typeof value === 'undefined' || value === null) return '-';
    const options = isDefined(numFractionDigits)
      ? {
          maximumFractionDigits: numFractionDigits,
          minimumFractionDigits: numFractionDigits,
        }
      : undefined;

    return Intl.NumberFormat(languageTag, options).format(Number(value));
  }

  function formatPercentage(
    value: number,
    options?: {
      maximumFractionDigits?: number;
      minimumFractionDigits?: number;
    }
  ) {
    return new Intl.NumberFormat(languageTag, options).format(value);
  }

  // Start of date formatting

  // Define all styles of formatting
  const Time = new Intl.DateTimeFormat(languageTag, {
    timeStyle: 'short',
    timeZone: 'Europe/Amsterdam',
  } as DateTimeFormatOptions);

  const Long = new Intl.DateTimeFormat(languageTag, {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Amsterdam',
  } as DateTimeFormatOptions);

  const Medium = new Intl.DateTimeFormat(languageTag, {
    dateStyle: 'long',
    timeZone: 'Europe/Amsterdam',
  } as DateTimeFormatOptions);

  // Day Month or Month Day depending on the locale
  const DayMonth = new Intl.DateTimeFormat(languageTag, {
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Amsterdam',
  });

  const DayMonthShort = new Intl.DateTimeFormat(languageTag, {
    month: 'short',
    day: 'numeric',
    timeZone: 'Europe/Amsterdam',
  });

  const DayMonthShortYear = new Intl.DateTimeFormat(languageTag, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  });

  const sharedWeekdayOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Amsterdam',
  };

  const WeekdayMedium = new Intl.DateTimeFormat(languageTag, {
    ...sharedWeekdayOptions,
  } as DateTimeFormatOptions);

  const WeekdayLong = new Intl.DateTimeFormat(languageTag, {
    ...sharedWeekdayOptions,
    year: 'numeric',
  } as DateTimeFormatOptions);

  // The actual functions

  /**
   * This formatting-cache will improve date formatting performance in
   * I̶n̶t̶e̶r̶n̶e̶t̶ ̶E̶x̶p̶l̶o̶r̶e̶r̶ Safari.
   * Formatting a date could easily take 20ms+, this is now reduced to < 1ms.
   */
  const formatCache: Record<string, string> = {};

  function getFormattedDate(date: Date, style: formatStyle) {
    switch (style) {
      case 'time': // '09:24'
        return Time.format(date);

      case 'iso': // '2020-07-23T10:01:16.000Z'
        return new Date(date).toISOString();

      case 'long': // '23 juli 2020 om 12:01'
        return Long.format(date);

      case 'medium': // '23 juli 2020'
        return Medium.format(date);

      case 'axis': // '23 jul'
        return DayMonthShort.format(date).replace(/\./g, '');

      case 'axis-with-year': // '23 jul 2021'
        return DayMonthShortYear.format(date).replace(/\./g, '');

      case 'weekday-medium':
        return WeekdayMedium.format(date);

      case 'weekday-long':
        return WeekdayLong.format(date);

      case 'day-month':
      default:
        return DayMonth.format(date);
    }
  }

  /**
   * Returns one of `vandaag` | `gisteren` | `eergisteren`.
   * If given date is more than 2 days ago it will return `undefined`.
   */
  function formatRelativeDate(dateDefinition: DateDefinition) {
    const date = parseDateDefinition(dateDefinition);

    if (typeof window === 'undefined') {
      throw new Error('formatRelativeDate cannot be called server-side');
    }

    return isToday(date) ? text.date_today : isYesterday(date) ? text.date_yesterday : isDayBeforeYesterday(date, new Date()) ? text.date_day_before_yesterday : undefined;
  }

  function formatDate(dateOrTimestamp: Date | number, style: formatStyle = 'day-month') {
    const date = dateOrTimestamp instanceof Date ? dateOrTimestamp : new Date(dateOrTimestamp as number);

    const cacheKey = `${date.getTime()}-${style}`;
    const dateCached = formatCache[cacheKey];

    if (dateCached) return dateCached;

    const formattedDate = getFormattedDate(date, style);
    formatCache[cacheKey] = formattedDate;

    return formattedDate;
  }

  /**
   * formatDateFromTo expects 2 dates and will return them as strings to be
   * rendered as a date range with respect for a range spanning multiple months.
   *
   * eg.
   *
   *     formatDateFromTo(1 maart, 7 maart)
   *     output: ['1', '7 maart']
   *
   * or:
   *
   *    formatDateFromTo(29 maart, 4 april)
   *    output: ['29 maart', '4 april']
   */
  function formatDateSpan(startDateDefinition: DateDefinition, endDateDefinition: DateDefinition, format?: formatStyle) {
    const startDate = parseDateDefinition(startDateDefinition);
    const endDate = parseDateDefinition(endDateDefinition);

    const isSameMonth = startDate.getMonth() === endDate.getMonth();

    const startDateText = isSameMonth ? `${startDate.getDate()}` : formatDate(startDate, format);
    const endDateText = formatDate(endDate, format);

    return [startDateText, endDateText] as [start: string, end: string];
  }

  function formatDateFromSeconds(seconds: number, style?: formatStyle) {
    assert(!isNaN(seconds), 'seconds is NaN');

    /**
     * JavaScript uses milliseconds since EPOCH, therefore the value
     * formatted by the format() function needs to be multiplied by 1000
     * to format to an accurate dateTime
     */

    const milliseconds = seconds * 1000;

    return formatDateFromMilliseconds(milliseconds, style);
  }

  function formatDateFromMilliseconds(milliseconds: number, style?: formatStyle) {
    assert(!isNaN(milliseconds), 'milliseconds is NaN');

    return formatDate(new Date(milliseconds), style);
  }

  return {
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateFromSeconds,
    formatDateFromMilliseconds,
    formatRelativeDate,
    formatDateSpan,
  };
}
