/**
 * Format a number into a locale-aware formatted string.
 */
function formatDecimal(n: number, locale = 'nl-NL'): string {
  const formatter = new Intl.NumberFormat(locale);
  return formatter.format(n);
}

export default formatDecimal;
