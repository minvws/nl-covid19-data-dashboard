import type { ParsedFeature } from '@visx/geo/lib/projections/Projection';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import { isPresent } from 'ts-is-present';
import type {
  ChoroplethDataItem,
  CodedGeoProperties,
  CodeProp,
  GmDataItem,
  InDataItem,
  ParsedFeatureWithPath,
  VrDataItem,
} from './types';

export function isCodedValueType(codeType: CodeProp) {
  switch (codeType) {
    case 'gmcode':
      return isGmData;
    case 'vrcode':
      return isVrData;
    case 'country_code':
      return isInData;
  }
}

export function isGmData(item: ChoroplethDataItem): item is GmDataItem {
  return 'gmcode' in item;
}

export function isVrData(item: ChoroplethDataItem): item is VrDataItem {
  return 'vrcode' in item;
}

export function isInData(item: ChoroplethDataItem): item is InDataItem {
  return 'country_code' in item;
}

export function featureHasPath(
  value: ParsedFeature<Feature<MultiPolygon | Polygon, CodedGeoProperties>>
): value is ParsedFeatureWithPath {
  return isPresent(value.path);
}

/**
 * Take the feature path and round each coordinate to create a smaller number, hence decreasing the file size immensely.
 * The extra feature detail isn't needed, since the difference between coordinate 30.4323424323423424 or 30.43 isn't visible
 * on the resolutions that the maps are being rendered in.
 */
export function truncatePathCoordinates(feature: ParsedFeatureWithPath) {
  return {
    ...feature,
    path: feature.path.replace(
      /\d+\.\d+/g,
      (x) => Math.round(parseFloat(x)) + ''
    ),
  };
}
