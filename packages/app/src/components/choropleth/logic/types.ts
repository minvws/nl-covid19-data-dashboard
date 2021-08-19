import {
  GmCollection,
  InCollection,
  KeysOfType,
  VrCollection,
} from '@corona-dashboard/common';
import { ParsedFeature } from '@visx/geo/lib/projections/Projection';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { CodedGeoProperties } from './topology';

export type Unpack<T> = T extends infer U ? U : never;

/**
 * Sets the projection’s scale and translate to fit the specified GeoJSON object in the center of the given extent.
 * The extent is specified as an array [[x₀, y₀], [x₁, y₁]], where x₀ is the left side of the bounding box,
 * y₀ is the top, x₁ is the right and y₁ is the bottom.
 *
 * (Description taken from ProjectionProps.fitExtent in @visx/Projection.d.ts)
 */
export type FitExtent = [[[number, number], [number, number]], any];

export enum CHOROPLETH_ASPECT_RATIO {
  nl = 1 / 1.2,
  in = 1 / 0.775,
}

export type MapType = 'gm' | 'vr' | 'in';

export type CodeProp =
  | KeysOfType<InDataItem, string, true>
  | KeysOfType<VrDataItem, string, true>
  | KeysOfType<GmDataItem, string, true>;

export const mapToCodeType: Record<MapType, CodeProp> = {
  gm: 'gmcode',
  vr: 'vrcode',
  in: 'country_code',
};

/**
 * Select all the item types of all the properties from the InCollection with an array type that has a country_code property
 */
export type InDataItem = InCollection[KeysOfType<
  InCollection,
  { country_code: string }[]
>][number];

/**
 * Select all the item types of all the properties from the VrCollection with an array type that has a vrcode property
 */
export type VrDataItem = VrCollection[KeysOfType<
  VrCollection,
  { vrcode: string }[]
>][number];

/**
 * Select all the item types of all the properties from the GmCollection with an array type that has a gmcode property
 */
export type GmDataItem = GmCollection[KeysOfType<
  GmCollection,
  { gmcode: string }[]
>][number];

/**
 * Here we map a MapType to a corresponding DataItem type
 */
export type MappedDataItem<T extends MapType> = T extends 'gm'
  ? GmDataItem
  : T extends 'vr'
  ? VrDataItem
  : T extends 'in'
  ? InDataItem
  : never;

export type ChoroplethDataItem = GmDataItem | VrDataItem | InDataItem;

export type ParsedFeatureWithPath = Omit<
  ParsedFeature<Feature<MultiPolygon | Polygon, CodedGeoProperties>>,
  'path'
> & { path: string };
