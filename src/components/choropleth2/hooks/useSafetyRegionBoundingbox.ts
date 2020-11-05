import { SafetyRegionProperties } from '../shared';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo } from 'react';

/**
 * This hook returns the feature of the safety region with the given safety region code.
 * If the given code is undefined, it returns undefined.
 *
 * @param selectedRegion
 */
export function useSafetyRegionBoundingbox(
  regionGeo: FeatureCollection<MultiPolygon, SafetyRegionProperties>,
  selectedRegion?: string
) {
  return useMemo(() => {
    if (!selectedRegion) {
      return undefined;
    }

    const feature = regionGeo.features.find(
      (feat) => feat.properties.vrcode === selectedRegion
    );

    if (!feature) {
      return undefined;
    }

    return {
      ...regionGeo,
      features: [feature],
    };
  }, [selectedRegion, regionGeo]);
}
