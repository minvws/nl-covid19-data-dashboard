import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import {
  GmCollection,
  GmDifference,
  NlDifference,
  VrCollection,
  VrDifference,
} from './data';

/**
 * This type was taken from this Stack Overflow post: https://stackoverflow.com/questions/46583883/typescript-pick-properties-with-a-defined-type
 *
 * Returns an interface stripped of all keys that don't resolve to U, defaulting
 * to a non-strict comparison of T[key] extends U. Setting B to true performs
 * a strict type comparison of T[key] extends U & U extends T[key]
 *
 * Example, if one needs just the keys of type string:
 *
 * type SomeType = {
 *   key1: string;
 *   key2: string;
 *   key3: number;
 * }
 *
 * const stringKeys = KeysOfType<SomeType, string>
 *
 * (stringKeys = key1 | key2)
 *
 */
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

/**
 * This returns a filtered type that only contains the keys of the specified type.
 *
 * type SomeType = {
 *   key1: string;
 *   key2: string;
 *   key3: number;
 * }
 *
 * const TypeWithJustStringKeys = PickByType<SomeType, string>
 *
 * (TypeWithJustStringKeys = {
 *   key1: string;
 *   key2: string;
 * })
 *
 */
export type PickByType<T, U, B = false> = Pick<T, KeysOfType<T, U, B>>;

export type Metric<T> = {
  values: T[];
  last_value: T;
};

export type MetricKeys<T> = keyof Omit<
  T,
  'last_generated' | 'proto_name' | 'name' | 'code'
>;

export type GmCollectionMetricName = MetricKeys<GmCollection>;
export type VrCollectionMetricName = MetricKeys<VrCollection>;

export type DifferenceKey =
  | keyof NlDifference
  | keyof VrDifference
  | keyof GmDifference;

export interface VrGeoProperties {
  vrcode: string;
  vrname: string;
}
export interface GmGeoProperties {
  gemnaam: string;
  gemcode: string;
  gmcode: string;
}

export type InGeoProperties = { ISO_A3: string };

export type InGeoJSON = FeatureCollection<MultiPolygon, InGeoProperties>;

export type GmGeoJSON = FeatureCollection<
  MultiPolygon | Polygon,
  GmGeoProperties
>;

export type VrGeoJSON = FeatureCollection<
  MultiPolygon | Polygon,
  VrGeoProperties
>;

export type ChoroplethThresholdsValue<T extends number = number> = {
  color: string;
  threshold: T;
  label?: string;
  /**
   * Optionally define the label which explains the "end" of a threshold
   */
  endLabel?: string;
};

export type Dictionary<T> = Partial<Record<string, T>>;
