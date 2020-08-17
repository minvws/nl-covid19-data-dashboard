import getLocale from 'utils/getLocale';

const locale = getLocale();

const NumberFormat = new Intl.NumberFormat(locale);

export default formatNumber;

function formatNumber(value: number | string | undefined | null): string {
  if (typeof value === 'undefined' || value === null) return '-';

  return NumberFormat.format(Number(value));
}
