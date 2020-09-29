import { isToday, isYesterday } from 'date-fns';

import siteText from '~/locale/index';
import { getLocale } from '~/utils/getLocale';

const locale = getLocale();

// TypeScript is missing some types for `Intl.DateTimeFormat`.
// https://github.com/microsoft/TypeScript/issues/35865
interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

const Long = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Amsterdam',
} as DateTimeFormatOptions);

const Medium = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
  timeZone: 'Europe/Amsterdam',
} as DateTimeFormatOptions);

// Day Month or Month Day depending on the locale
const DayMonth = new Intl.DateTimeFormat(locale, {
  month: 'long',
  day: 'numeric',
  timeZone: 'Europe/Amsterdam',
});

const MonthShort = new Intl.DateTimeFormat(locale, {
  month: 'short',
  timeZone: 'Europe/Amsterdam',
});

const Day = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  timeZone: 'Europe/Amsterdam',
});

export function formatDate(
  seconds: number,
  style?: 'long' | 'medium' | 'short' | 'relative' | 'iso' | 'axis'
): string {
  /**
   * JavaScript uses milliseconds since EPOCH, therefore the value
   * formatted by the format() function needs to be multiplied by 1000
   * to format to an accurate dateTime
   */
  const value = seconds * 1000;

  if (style === 'iso') return new Date(value).toISOString(); // '2020-07-23T10:01:16.000Z'
  if (style === 'long') return Long.format(value); // '23 juli 2020 om 12:01'
  if (style === 'medium') return Medium.format(value); // '23 juli 2020'
  if (style === 'axis')
    return `${Day.format(value)} ${MonthShort.format(value)}`; // '23 jul.'

  if (style === 'relative') {
    if (isToday(value)) return siteText.utils.date_today;
    if (isYesterday(value)) return siteText.utils.date_yesterday;
  }

  return DayMonth.format(value);
}
