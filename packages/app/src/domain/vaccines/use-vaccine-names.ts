import { NlVaccineAdministeredValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { colors } from '~/style/theme';

export function useVaccineNames(
  lastValue: NlVaccineAdministeredValue
): string[] {
  return useMemo(() => {
    const productNames = Object.keys(colors.data.vaccines);
    return productNames.filter((x) => (lastValue as any)[x] !== undefined);
  }, [lastValue]);
}
