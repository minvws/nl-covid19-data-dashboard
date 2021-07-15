import { VrGeoJSON } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';

/**
 * This hook returns the feature of the safety region to which the given municipality code belongs.
 * If the given code is undefined, it returns undefined.
 *
 * @param regionGeo
 * @param selectedGm
 */
export function useGmBoundingbox(
  regionGeo: VrGeoJSON,
  selectedGm?: string
): [VrGeoJSON, string] | [undefined, undefined] {
  return useMemo(() => {
    if (!selectedGm) {
      return [undefined, undefined];
    }

    const vrcode = vrCodeByGmCode[selectedGm];

    if (vrcode) {
      const vrFeature = regionGeo.features.find(
        (feat) => feat.properties.vrcode === vrcode
      );

      if (!vrFeature) {
        return [undefined, undefined];
      }

      return [
        {
          ...regionGeo,
          features: [vrFeature],
        },
        vrcode,
      ];
    }

    return [undefined, undefined];
  }, [selectedGm, regionGeo]);
}
