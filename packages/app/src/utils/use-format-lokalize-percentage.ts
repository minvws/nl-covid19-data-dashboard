import { useIntl } from '~/intl';

/**
 * Util helper that helps render a percentage confirming the locale:
 */

export function useFormatLokalizePercentage() {
  const { formatPercentage } = useIntl();

  function formatPercentageAsNumber(percentage: string) {
    return Math.round(parseFloat(percentage.replace(',', '.')) * 10) / 10
  }
  function formatLokalizePercentage(percentage: string) {
      return formatPercentage(formatPercentageAsNumber(percentage))
  }

  return {formatLokalizePercentage, formatPercentageAsNumber};
}
