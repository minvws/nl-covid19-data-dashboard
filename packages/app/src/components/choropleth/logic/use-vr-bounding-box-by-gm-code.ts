import { VrGeoJSON } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';

/**
 * This hook returns the feature of the safety region to which the given municipality code belongs.
 * If the given code is undefined, it returns undefined.
 *
 */
export function useVrBoundingBoxByGmCode(
  vrGeo: VrGeoJSON,
  gmcode?: string
): [VrGeoJSON, string] | [undefined, undefined] {
  return useMemo(() => {
    if (!gmcode) {
      return [undefined, undefined];
    }

    const vrcode = vrCodeByGmCode[gmcode];

    if (vrcode) {
      const vrFeature = vrGeo.features.find(
        (feat) => feat.properties.vrcode === vrcode
      );

      if (!vrFeature) {
        return [undefined, undefined];
      }

      return [
        {
          ...vrGeo,
          features: [vrFeature],
        },
        vrcode,
      ];
    }

    return [undefined, undefined];
  }, [gmcode, vrGeo]);
}
