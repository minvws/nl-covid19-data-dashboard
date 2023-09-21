import type {
  ArchivedGmCollection,
  ArchivedGmCollectionHospitalNiceChoropleth,
  GmCollection,
  GmCollectionHospitalNiceChoropleth,
  GmCollectionSewer,
  ArchivedGmCollectionTestedOverall,
  ArchivedVrCollection,
  VrCollectionVulnerableNursingHome,
  VrCollectionElderlyAtHome,
  VrCollectionDisabilityCare,
  ArchivedGmCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import type { ParsedFeature } from '@visx/geo/lib/projections/Projection';
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

/**
 * Infers the given type of T, if possible
 */
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
}

/**
 * gm - Municipality, indicates a map of the Netherlands that shows the different municipalities
 * vr - Safety region, indicates a map of the Netherlands that shows the different safety regions
 */
export type MapType = 'gm' | 'vr';

export type CodeProp = 'vrcode' | 'gmcode';

export const mapToCodeType: Record<MapType, CodeProp> = {
  gm: 'gmcode',
  vr: 'vrcode',
};

export type ChoroplethCollection = GmCollection | ArchivedGmCollection | ArchivedVrCollection;

export type InferedMapType<T extends ChoroplethDataItem> = T extends GmDataItem | ArchivedGmDataItem ? 'gm' : T extends ArchivedVrDataItem ? 'vr' : never;

export type InferedDataCollection<T extends ChoroplethDataItem> = T extends GmDataItem
  ? GmCollection
  : T extends ArchivedGmDataItem
  ? ArchivedGmCollection
  : T extends ArchivedVrDataItem
  ? ArchivedVrCollection
  : never;

export type GmDataCollection = GmCollectionHospitalNiceChoropleth[] | GmCollectionSewer[];
export type GmDataItem = GmDataCollection[number];

export type ArchivedGmDataCollection = ArchivedGmCollectionTestedOverall[] | ArchivedGmCollectionHospitalNiceChoropleth[] | ArchivedGmCollectionVaccineCoveragePerAgeGroup[];
export type ArchivedGmDataItem = ArchivedGmDataCollection[number];

export type ArchivedVrDataCollection = VrCollectionVulnerableNursingHome[] | VrCollectionElderlyAtHome[] | VrCollectionDisabilityCare[];
export type ArchivedVrDataItem = ArchivedVrDataCollection[number];

export type ChoroplethDataItem = GmDataItem | ArchivedGmDataItem | ArchivedVrDataItem;

export type CodedGeoProperties = {
  code: string;
};

export type CodedGeoJSON = FeatureCollection<MultiPolygon | Polygon, CodedGeoProperties>;

export type ParsedFeatureWithPath = Omit<ParsedFeature<Feature<MultiPolygon | Polygon, CodedGeoProperties>>, 'path'> & { path: string };
