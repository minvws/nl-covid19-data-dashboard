import { FeatureCollection, MultiPolygon } from 'geojson';
import {
  MunicipalDifference,
  Municipalities,
  NationalDifference,
  Regions,
  RegionalDifference,
} from './data';

export type Metric<T> = {
  values: T[];
  last_value: T;
};

export type MetricKeys<T> = keyof Omit<
  T,
  'last_generated' | 'proto_name' | 'name' | 'code'
>;

export type MunicipalitiesMetricName = MetricKeys<Municipalities>;
export type RegionsMetricName = MetricKeys<Regions>;

export type DifferenceKey =
  | keyof NationalDifference
  | keyof RegionalDifference
  | keyof MunicipalDifference;

export interface SafetyRegionProperties {
  vrcode: string;
  vrname: string;
}
export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
  gmcode: string;
}

export type MunicipalGeoJSON = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;

export type RegionGeoJSON = FeatureCollection<
  MultiPolygon,
  SafetyRegionProperties
>;

export type ChoroplethThresholdsValue<T extends number = number> = {
  color: string;
  threshold: T;
  label?: string;
  /**
   * Optiobally define the label which explains the "end" of a threshold
   */
  endLabel?: string;
};

export type Dictionary<T> = Partial<Record<string, T>>;
