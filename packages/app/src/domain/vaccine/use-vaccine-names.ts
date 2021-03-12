import { assert, NlVaccineAdministeredValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { colors } from '~/style/theme';

const vaccines = [
  'bio_n_tech_pfizer',
  'moderna',
  'astra_zeneca',
  'cure_vac',
  'janssen',
  'sanofi',
  // @TODO remove when data is updated to new name bio_n_tech_pfizer or chart is
  // replaced with TimeSeriesChart or similar component.
  'pfizer',
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
