import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import * as topojson from 'topojson-client';
import inTopology from './in.topo.json';
import nlTopology from './nl-vr-gm.topo.json';

export type BasicGeoProperties = {
  code: string;
};

export type NamedBasicGeoProperties = {
  name: string;
} & BasicGeoProperties;

export type NlGeoJSON = FeatureCollection<
  MultiPolygon | Polygon,
  NamedBasicGeoProperties
>;

export type InGeoJSON = FeatureCollection<
  MultiPolygon | Polygon,
  BasicGeoProperties
>;

export const nlGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.nl_features
) as FeatureCollection<MultiPolygon>;

export const vrGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.vr_features
) as NlGeoJSON;

export const gmGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.gm_features
) as NlGeoJSON;

export const inGeo = topojson.feature(
  inTopology,
  inTopology.objects.in_features
) as InGeoJSON;
