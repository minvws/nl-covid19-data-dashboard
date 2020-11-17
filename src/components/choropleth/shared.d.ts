import { FeatureCollection, MultiPolygon } from 'geojson';
import { Municipalities, Regions, RegionsNursingHome } from '~/types/data';

type TMetricHolder<T> = keyof Omit<
  T,
  'last_generated' | 'proto_name' | 'name' | 'code'
>;

export type TMunicipalityMetricName = TMetricHolder<
  Omit<Municipalities, 'deceased'>
>;

export type TMunicipalityMetricType = ValueOf<
  Pick<Municipalities, TMunicipalityMetricName>
>[number] &
  Partial<MunicipalityProperties>;

export type TRegionMetricName = TMetricHolder<Omit<Regions, 'deceased'>>;

export type TRegionMetricType = ValueOf<
  Pick<Regions, TRegionMetricName>
>[number] &
  Partial<SafetyRegionProperties>;

export type TRegionsNursingHomeMetricName = keyof Omit<
  RegionsNursingHome,
  'date_of_report_unix' | 'date_of_insertion_unix' | 'vrcode'
>;

export interface SafetyRegionProperties {
  vrcode: string;
  vrname: string;
}
export interface MunicipalityProperties {
  gemnaam: string;
  gemcode: string;
}

export type MunicipalGeoJSON = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;

export type RegionGeoJSON = FeatureCollection<
  MultiPolygon,
  SafetyRegionProperties
>;

export type ChoroplethThresholds = {
  thresholds: ChoroplethThresholdsValue[];
};

export type ChoroplethThresholdsValue = {
  color: string;
  threshold: number;
};
