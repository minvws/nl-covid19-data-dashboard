import { FeatureCollection, MultiPolygon } from 'geojson';
import { Municipalities } from 'types/data';
import { MunicipalityProperties } from './MunicipalityChloropleth';

export type TMunicipalityMetricName = keyof Omit<
  Municipalities,
  'last_generated' | 'proto_name' | 'name' | 'code'
>;

export type MunicipalGeoJOSN = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;
