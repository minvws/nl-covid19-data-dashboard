import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import * as topojson from 'topojson-client';
import nlTopology from '../topo-json/nl-vr-gm.topo.json';

export type CodedGeoProperties = {
  code: string;
};

export type CodedGeoJSON = FeatureCollection<
  MultiPolygon | Polygon,
  CodedGeoProperties
>;

export const nlGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.nl_features
) as CodedGeoJSON;

export const vrGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.vr_features
) as CodedGeoJSON;

export const gmGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.gm_features
) as CodedGeoJSON;
