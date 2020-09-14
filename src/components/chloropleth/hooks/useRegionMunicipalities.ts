import { useMemo } from 'react';
import getSafetyRegionMunicipalsForMunicipalCode from 'utils/getSafetyRegionMunicipalsForMunicipalCode';

/**
 * This hook returns all the municipal codes that belong to the same safety region
 * as the given municipal code.
 *
 * @param municipalCode
 */
export default function useRegionMunicipalities(
  municipalCode?: string
): string[] | undefined {
  return useMemo(() => {
    if (!municipalCode) {
      return undefined;
    }

    return getSafetyRegionMunicipalsForMunicipalCode(municipalCode);
  }, [municipalCode]);
}
