import { FeatureCollection, MultiPolygon } from 'geojson';
import { Municipalities } from 'types/data';

export type TMunicipalityMetricName = keyof Omit<
  Municipalities,
  'last_generated' | 'proto_name' | 'name' | 'code'
>;

export interface SafetyRegionProperties {
  vrcode: string;
  vrname: string;
}
export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

export type MunicipalGeoJOSN = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;

export type RegionGeoJOSN = FeatureCollection<
  MultiPolygon,
  SafetyRegionProperties
>;
