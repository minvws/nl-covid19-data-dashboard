import { useMemo } from 'react';
import getSafetyRegionForMunicipal from 'utils/getSafetyRegionForMunicipal';

export default function useRegionMunicipalities(
  selected?: string
): string[] | undefined {
  return useMemo(() => {
    if (!selected) {
      return undefined;
    }
    return getSafetyRegionForMunicipal(selected);
  }, [selected]);
}
