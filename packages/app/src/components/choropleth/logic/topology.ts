import { GmGeoJSON, InGeoJSON, VrGeoJSON } from '@corona-dashboard/common';
import { FeatureCollection, MultiPolygon } from 'geojson';
import * as topojson from 'topojson-client';
import inTopology from './geography-europe-simplified.json';
// Load all the geographical data including the data entries (regions and municipalities)
import nlTopology from './geography-simplified.topo.json';

export const nlGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.nl_features
) as FeatureCollection<MultiPolygon>;

export const vrGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.vr_features
) as VrGeoJSON;

export const gmGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.gm_features
) as GmGeoJSON;

export const inGeo = topojson.feature(
  inTopology,
  inTopology.objects.in_features
) as InGeoJSON;
