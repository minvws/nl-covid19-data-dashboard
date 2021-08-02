import { VrProperties } from '@corona-dashboard/common';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useMemo } from 'react';

/**
 * This hook returns the feature of the safety region with the given safety region code.
 * If the given code is undefined, it returns undefined.
 *
 * @param selectedRegion
 */
export function useVrBoundingbox(
  regionGeo: FeatureCollection<MultiPolygon | Polygon, VrProperties>,
  selectedRegion?: string
) {
  return useMemo(() => {
    if (!selectedRegion) {
      return;
    }

    const feature = regionGeo.features.find(
      (feat) => feat.properties.vrcode === selectedRegion
    );

    if (!feature) {
      return;
    }

    return {
      ...regionGeo,
      features: [feature],
    };
  }, [selectedRegion, regionGeo]);
}
