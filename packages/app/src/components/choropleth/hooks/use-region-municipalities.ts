import { useMemo } from 'react';
import { getSafetyRegionMunicipalsForMunicipalCode } from '~/utils/get-safety-region-municipals-for-Mmunicipal-code';

/**
 * This hook returns all the municipal codes that belong to the same safety region
 * as the given municipal code.
 *
 * @param municipalCode
 */
export function useRegionMunicipalities(
  municipalCode?: string
): string[] | undefined {
  return useMemo(() => {
    if (!municipalCode) {
      return;
    }

    return getSafetyRegionMunicipalsForMunicipalCode(municipalCode);
  }, [municipalCode]);
}
