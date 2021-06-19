import { FeatureCollection, MultiPolygon } from 'geojson';
import {
  MunicipalDifference,
  Municipalities,
  NationalDifference,
  RegionalDifference,
  Regions,
} from './data';

export type KeysOfType<T, U, B = false> = {
  [P in keyof T]: B extends true
    ? T[P] extends U
      ? U extends T[P]
        ? P
        : never
      : never
    : T[P] extends U
    ? P
    : never;
}[keyof T];

export type PickByType<T, U, B = false> = Pick<T, KeysOfType<T, U, B>>;

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
