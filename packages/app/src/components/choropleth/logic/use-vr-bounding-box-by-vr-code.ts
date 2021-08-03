import { VrProperties } from '@corona-dashboard/common';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useMemo } from 'react';

/**
 * This hook returns the feature of the safety region with the given safety region code.
 * If the given code is undefined, it returns undefined.
 *
 */
export function useVrBoundingBoxByVrCode(
  regionGeo: FeatureCollection<MultiPolygon | Polygon, VrProperties>,
  vrcode?: string
) {
  return useMemo(() => {
    if (!vrcode) {
      return;
    }

    const feature = regionGeo.features.find(
      (feat) => feat.properties.vrcode === vrcode
    );

    if (!feature) {
      return;
    }

    return {
      ...regionGeo,
      features: [feature],
    };
  }, [vrcode, regionGeo]);
}
