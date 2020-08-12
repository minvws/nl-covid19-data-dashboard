import getLocale from 'utils/getLocale';

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
} as DateTimeFormatOptions);

const MonthShort = new Intl.DateTimeFormat(locale, {
  month: 'short',
} as DateTimeFormatOptions);

const Day = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
} as DateTimeFormatOptions);

function formatDate(
  number: number | Date,
  style?: 'long' | 'medium' | 'short' | 'iso' | 'axis'
): string {
  if (style === 'iso') return new Date(number).toISOString(); // '2020-07-23T10:01:16.000Z'
  if (style === 'long') return Long.format(number); // '23 juli 2020 om 12:01'
  if (style === 'medium') return Medium.format(number); // '23 juli 2020'
  if (style === 'short') return `${Day.format(number)} ${Month.format(number)}`; // '23 juli'
  if (style === 'axis')
    return `${Day.format(number)} ${MonthShort.format(number)}`; // '23 jul.'

  return `${Day.format(number)} ${Month.format(number)}`; // '23 juli'
}
