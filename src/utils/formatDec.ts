/**
 * Format a number into a locale-aware formatted string.
 */
function formatDecimal(n: number | null, locale = 'nl-NL'): string | null {
  if (n === null) return n;
  const formatter = new Intl.NumberFormat(locale);
  return formatter.format(n);
}

export default formatDecimal;
