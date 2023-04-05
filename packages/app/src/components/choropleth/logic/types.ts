import type {
  GmCollection,
  GmCollectionHospitalNice,
  GmCollectionSewer,
  GmCollectionTestedOverall,
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollection,
  VrCollectionDisabilityCareArchived_20230126,
  VrCollectionElderlyAtHomeArchived_20230126,
  VrCollectionHospitalNice,
  VrCollectionNursingHomeArchived_20230126,
  VrCollectionVulnerableNursingHome,
  VrCollectionSewer,
  VrCollectionSituations,
  VrCollectionTestedOverall,
  VrCollectionVaccineCoveragePerAgeGroup,
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

export type ChoroplethCollection = GmCollection | VrCollection;

export type InferedMapType<T extends ChoroplethDataItem> = T extends GmDataItem ? 'gm' : T extends VrDataItem ? 'vr' : never;

export type InferedDataCollection<T extends ChoroplethDataItem> = T extends GmDataItem ? GmCollection : T extends VrDataItem ? VrCollection : never;

export type VrDataCollection =
  | VrCollectionHospitalNice[]
  | VrCollectionTestedOverall[]
  | VrCollectionNursingHomeArchived_20230126[]
  | VrCollectionVulnerableNursingHome[]
  | VrCollectionSewer[]
  | VrCollectionDisabilityCareArchived_20230126[]
  | VrCollectionElderlyAtHomeArchived_20230126[]
  | VrCollectionSituations[]
  | VrCollectionVaccineCoveragePerAgeGroup[];
export type VrDataItem = VrDataCollection[number];

export type GmDataCollection = GmCollectionHospitalNice[] | GmCollectionTestedOverall[] | GmCollectionSewer[] | GmCollectionVaccineCoveragePerAgeGroup[];
export type GmDataItem = GmDataCollection[number];

/**
 * Here we map a MapType to a corresponding DataCollection type
 */
export type MappedDataCollection<T extends MapType> = T extends 'gm' ? GmCollection : T extends 'vr' ? VrCollection : never;

/**
 * Here we map a MapType to a corresponding DataItem type
 */
export type MappedDataItem<T extends MapType> = T extends 'gm' ? GmDataItem : T extends 'vr' ? VrDataItem : never;

export type ChoroplethDataItem = GmDataItem | VrDataItem;

export type CodedGeoProperties = {
  code: string;
};

export type CodedGeoJSON = FeatureCollection<MultiPolygon | Polygon, CodedGeoProperties>;

export type ParsedFeatureWithPath = Omit<ParsedFeature<Feature<MultiPolygon | Polygon, CodedGeoProperties>>, 'path'> & { path: string };
