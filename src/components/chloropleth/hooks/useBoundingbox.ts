import { SafetyRegionProperties } from 'components/vx/SafetyRegionChloropleth';
import municipalCodeToRegionCodeLookup from 'data/municipalCodeToRegionCodeLookup';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo } from 'react';

export default function useBoundingbox(
  regionGeo: FeatureCollection<MultiPolygon, SafetyRegionProperties>,
  selected?: string
): FeatureCollection<MultiPolygon> | undefined {
  return useMemo(() => {
    if (!selected) {
      return undefined;
    }

    const vrcode = municipalCodeToRegionCodeLookup[selected];

    if (vrcode) {
      const feature = regionGeo.features.find(
        (feat) => feat.properties.vrcode === vrcode
      );
      if (!feature) {
        return undefined;
      }
      return {
        ...regionGeo,
        features: [feature],
      };
    }

    return undefined;
  }, [selected, regionGeo]);
}
