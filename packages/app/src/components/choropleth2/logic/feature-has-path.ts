import { ParsedFeature } from '@visx/geo/lib/projections/Projection';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { isPresent } from 'ts-is-present';
import { CodedGeoProperties } from './topology';
import { ParsedFeatureWithPath } from './types';

export function featureHasPath(
  value: ParsedFeature<Feature<MultiPolygon | Polygon, CodedGeoProperties>>
): value is ParsedFeatureWithPath {
  return isPresent(value.path);
}
