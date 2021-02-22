import { NlVaccineAdministeredValue } from '@corona-dashboard/common';
import { colors } from '~/style/theme';

export function useVaccineNames(
  lastValue: NlVaccineAdministeredValue
): string[] {
  const productNames = Object.keys(colors.data.vaccines);
  return productNames.filter((x) => (lastValue as any).hasOwnProperty(x));
}
