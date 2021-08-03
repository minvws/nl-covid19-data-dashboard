import { VrGeoJSON } from '@corona-dashboard/common';
import { useMemo } from 'react';

/**
 * This hook returns the feature of the safety region with the given safety region code.
 * If the given code is undefined, it returns undefined.
 *
 */
export function useVrBoundingBoxByVrCode(vrGeo: VrGeoJSON, vrcode?: string) {
  return useMemo(() => {
    if (!vrcode) {
      return;
    }

    const feature = vrGeo.features.find(
      (feat) => feat.properties.vrcode === vrcode
    );

    if (!feature) {
      return;
    }

    return {
      ...vrGeo,
      features: [feature],
    };
  }, [vrcode, vrGeo]);
}
