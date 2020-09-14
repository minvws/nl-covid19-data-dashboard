import { FeatureCollection, MultiPolygon } from 'geojson';
import { Municipalities, Regions } from 'types/data';

type TMetricHolder<T> = keyof Omit<
  T,
  'last_generated' | 'proto_name' | 'name' | 'code'
>;

export type TMunicipalityMetricName = TMetricHolder<Municipalities>;

export type TRegionMetricName = TMetricHolder<Regions>;

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
