/**
 * Format the percentage as a number containing decimals.
 *
 * This function is decimal separator agnostic.
 */

export function formatPercentageAsNumber(percentage: string) {
  return parseFloat(percentage.replace(',', '.'))
}
