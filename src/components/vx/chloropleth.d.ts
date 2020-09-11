import { FeatureCollection, MultiPolygon } from 'geojson';
import { SafetyRegionProperties } from './SafetyRegionChloropleth';
import { MunicipalityProperties } from './MunicipalityChloropleth';

export type SafetyRegionGeoJSON = FeatureCollection<
  MultiPolygon,
  SafetyRegionProperties
>;

export type MunicipalGeoJOSN = FeatureCollection<
  MultiPolygon,
  MunicipalityProperties
>;
