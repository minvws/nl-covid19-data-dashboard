import { isToday, isYesterday } from 'date-fns';

import siteText from 'locale';
import getLocale from 'utils/getLocale';
import replaceVariablesInText from './replaceVariablesInText';

const locale = getLocale();

export default formatDate;

// TypeScript is missing some types for `Intl.DateTimeFormat`.
// https://github.com/microsoft/TypeScript/issues/35865
interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

const Long = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
  timeStyle: 'short',
} as DateTimeFormatOptions);

const Medium = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
} as DateTimeFormatOptions);

const Month = new Intl.DateTimeFormat(locale, {
  month: 'long',
});

const MonthShort = new Intl.DateTimeFormat(locale, {
  month: 'short',
});

const Day = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
});

const shortFormat = locale === 'nl' ? '{{day}} {{month}}' : '{{month}} {{day}}';

function formatDate(
  value: number | Date,
  style?: 'long' | 'medium' | 'short' | 'relative' | 'iso' | 'axis'
): string {
  if (style === 'iso') return new Date(value).toISOString(); // '2020-07-23T10:01:16.000Z'
  if (style === 'long') return Long.format(value); // '23 juli 2020 om 12:01'
  if (style === 'medium') return Medium.format(value); // '23 juli 2020'
  if (style === 'axis')
    return `${Day.format(value)} ${MonthShort.format(value)}`; // '23 jul.'

  if (style === 'relative') {
    if (isToday(value)) return siteText.utils.date_today;
    if (isYesterday(value)) return siteText.utils.date_yesterday;
  }

  // short or relative
  return replaceVariablesInText(shortFormat, {
    day: Day.format(value),
    month: Month.format(value),
  });
}
