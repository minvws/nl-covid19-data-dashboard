import { ParsedFeature } from '@visx/geo/lib/projections/Projection';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { isPresent } from 'ts-is-present';
import { CodedGeoProperties } from './topology';
import {
  ChoroplethDataItem,
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
