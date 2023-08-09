import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import type { MetricKeys } from '.';
import type { GmCollection, GmDifference, NlDifference, ArchivedVrCollection } from './data';

export type Metric<T> = {
  values: T[];
  last_value: T;
};

export type GmCollectionMetricName = MetricKeys<GmCollection>;
export type VrCollectionMetricName = MetricKeys<ArchivedVrCollection>;

export type DifferenceKey = keyof NlDifference | keyof GmDifference;

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

export type GmGeoJSON = FeatureCollection<MultiPolygon | Polygon, GmGeoProperties>;

export type VrGeoJSON = FeatureCollection<MultiPolygon | Polygon, VrGeoProperties>;

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

export type Unpack<T> = T extends infer U ? U : never;
