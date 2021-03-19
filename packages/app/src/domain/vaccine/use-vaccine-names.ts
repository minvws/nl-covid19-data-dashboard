import { assert, NlVaccineAdministeredValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { colors } from '~/style/theme';

/**
 * Beware: the order of names in this array also dictates the rendering order in
 * the "berggrafiek".
 *
 * @TODO remove pfizer when data is updated to new name bio_n_tech_pfizer or
 * chart is replaced with TimeSeriesChart or similar component.
 */
const vaccines = [
  'pfizer',
  'bio_n_tech_pfizer',
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
