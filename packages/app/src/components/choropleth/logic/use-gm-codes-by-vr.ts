import { useMemo } from 'react';
import { getVrMunicipalsForMunicipalCode } from '~/utils/get-vr-municipals-for-municipal-code';

/**
 * This hook returns all the municipal codes that belong to the same safety region
 * as the given municipal code.
 *
 * @param municipalCode
 */
export function useGmCodesByVr(municipalCode?: string): string[] | undefined {
  return useMemo(() => {
    if (!municipalCode) {
      return;
    }

    return getVrMunicipalsForMunicipalCode(municipalCode);
  }, [municipalCode]);
}
