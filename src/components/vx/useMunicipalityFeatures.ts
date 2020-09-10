import { MultiPolygon, FeatureCollection } from 'geojson';
import { useMemo } from 'react';
import getSafetyRegionForMunicipal from 'utils/getSafetyRegionForMunicipal';
import { MunicipalityProperties } from './MunicipalityChloropleth';
import filterFeatures from './filterFeatures';

export default function useMunicipalityFeatures(
  featureCollection: FeatureCollection<MultiPolygon, MunicipalityProperties>,
  selected?: string
) {
  return useMemo(() => {
    if (!selected) {
      return featureCollection;
    }

    const municipalCodes = getSafetyRegionForMunicipal(selected);

    if (municipalCodes) {
      return filterFeatures(featureCollection, 'gemcode', municipalCodes);
    }
    return featureCollection;
  }, [featureCollection, selected]);
}
