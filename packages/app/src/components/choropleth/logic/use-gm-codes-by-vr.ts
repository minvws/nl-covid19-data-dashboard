import { useMemo } from 'react';
import { getVrMunicipalsForMunicipalCode } from '~/utils/get-vr-municipals-for-municipal-code';

/**
 * This hook returns all the municipal codes that belong to the same safety region
 * as the given municipal code.
 *
 */
export function useGmCodesByVr(gmCode?: string): string[] | undefined {
  return useMemo(() => {
    if (!gmCode) {
      return;
    }

    return getVrMunicipalsForMunicipalCode(gmCode);
  }, [gmCode]);
}
