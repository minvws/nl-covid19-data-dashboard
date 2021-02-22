import { assert, NlVaccineAdministeredValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { colors } from '~/style/theme';

const vaccines = [
  'pfizer',
  'moderna',
  'astra_zeneca',
  'cure_vac',
  'janssen',
  'sanofi',
] as const;

vaccines.forEach((x) =>
  assert(colors.data.vaccines[x], `missing vaccine color for vaccine ${x}`)
);

export function useVaccineNames(
  lastValue: NlVaccineAdministeredValue
): string[] {
  return useMemo(() => {
    return vaccines.filter((x) => (lastValue as any)[x] !== undefined);
  }, [lastValue]);
}
