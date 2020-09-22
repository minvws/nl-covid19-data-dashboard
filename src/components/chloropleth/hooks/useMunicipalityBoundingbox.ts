import { SafetyRegionProperties } from '../shared';
import municipalCodeToRegionCodeLookup from '~/data/municipalCodeToRegionCodeLookup';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo } from 'react';

/**
 * This hook returns the feature of the safety region to which the given municipality code belongs.
 * If the given code is undefined, it returns undefined.
 *
 * @param regionGeo
 * @param selectedMunicipality
 */
export function useMunicipalityBoundingbox(
  regionGeo: FeatureCollection<MultiPolygon, SafetyRegionProperties>,
  selectedMunicipality?: string
): [FeatureCollection<MultiPolygon>, string] | [undefined, undefined] {
  return useMemo(() => {
    if (!selectedMunicipality) {
      return [undefined, undefined];
    }

    const vrcode = municipalCodeToRegionCodeLookup[selectedMunicipality];

    if (vrcode) {
      const feature = regionGeo.features.find(
        (feat) => feat.properties.vrcode === vrcode
      );
      if (!feature) {
        return [undefined, undefined];
      }
      return [
        {
          ...regionGeo,
          features: [feature],
        },
        vrcode,
      ];
    }

    return [undefined, undefined];
  }, [selectedMunicipality, regionGeo]);
}
