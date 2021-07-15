import { useMemo } from 'react';
import { getVrGmCollectionForGmCode } from '~/utils/get-vr-gm-collection-for-gm-code';

/**
 * This hook returns all the municipal codes that belong to the same safety region
 * as the given municipal code.
 *
 * @param gmCodes
 */
export function useRegionGmCollection(gmCode?: string): string[] | undefined {
  return useMemo(() => {
    if (!gmCode) {
      return;
    }

    return getVrGmCollectionForGmCode(gmCode);
  }, [gmCode]);
}
