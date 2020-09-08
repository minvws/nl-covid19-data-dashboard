import { FeatureCollection, MultiPolygon, Feature } from 'geojson';
import { MunicipalityProperties } from './MunicipalityChloropleth';

export default function sortFeatures(
  featureCollection: FeatureCollection<MultiPolygon, MunicipalityProperties>,
  selected?: string
): Feature<MultiPolygon, MunicipalityProperties>[] {
  if (!selected) {
    return featureCollection.features;
  }

  return featureCollection.features.sort((featA, featB): number => {
    if (featA.properties.gemcode === selected) {
      return 1;
    }
    if (featB.properties.gemcode === selected) {
      return -1;
    }
    return 0;
  });
}
