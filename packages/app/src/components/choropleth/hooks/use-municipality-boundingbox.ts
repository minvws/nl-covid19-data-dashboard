import { useMemo } from 'react';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';
import { RegionGeoJSON } from '@corona-dashboard/common';

/**
 * This hook returns the feature of the safety region to which the given municipality code belongs.
 * If the given code is undefined, it returns undefined.
 *
 * @param regionGeo
 * @param selectedMunicipality
 */
export function useMunicipalityBoundingbox(
  regionGeo: RegionGeoJSON,
  selectedMunicipality?: string
): [RegionGeoJSON, string] | [undefined, undefined] {
  return useMemo(() => {
    if (!selectedMunicipality) {
      return [undefined, undefined];
    }

    const vrcode = vrCodeByGmCode[selectedMunicipality];

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
  }, [selectedMunicipality, regionGeo]);
}
