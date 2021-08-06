import {
  GmCollection,
  InCollection,
  KeysOfType,
  VrCollection,
} from '@corona-dashboard/common';

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

export type InDataItem = InCollection[KeysOfType<
  InCollection,
  { country_code: string }[]
>][number];

export type VrDataItem = VrCollection[KeysOfType<
  VrCollection,
  { vrcode: string }[]
>][number];

export type GmDataItem = GmCollection[KeysOfType<
  GmCollection,
  { gmcode: string }[]
>][number];

export type InferredDataItem<T extends MapType> = T extends 'gm'
  ? GmDataItem
  : T extends 'vr'
  ? VrDataItem
  : InDataItem;

export type ChoroplethDataItem = GmDataItem | VrDataItem | InDataItem;
