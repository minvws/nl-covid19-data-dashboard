import { FeatureCollection, MultiPolygon, Feature } from 'geojson';

export default function sortFeatures<T>(
  featureCollection: FeatureCollection<MultiPolygon, T>,
  propertyName: keyof T,
  selected?: T[keyof T]
): Feature<MultiPolygon, T>[] {
  if (!selected) {
    return featureCollection.features;
  }

  return featureCollection.features.sort((featA, featB): number => {
    if (featA.properties[propertyName] === selected) {
      return 1;
    }
    if (featB.properties[propertyName] === selected) {
      return -1;
    }
    return 0;
  });
}
