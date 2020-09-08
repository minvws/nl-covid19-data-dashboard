import {
  FeatureCollection,
  GeoJsonProperties,
  Feature,
  Geometry,
  MultiPolygon,
} from 'geojson';

function filterFeatures<
  T extends GeoJsonProperties,
  K extends Geometry = MultiPolygon
>(
  collection: FeatureCollection<K, T>,
  key: keyof T,
  value: T[keyof T][]
): FeatureCollection<K, T> {
  const result = {
    ...collection,
    features: collection.features.filter(
      (feat: Feature<K, T>): boolean =>
        feat.properties &&
        typeof key === 'string' &&
        value.indexOf(feat.properties[key]) > -1
    ),
  };
  return result;
}

export default filterFeatures;
