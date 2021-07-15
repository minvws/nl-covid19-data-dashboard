import { EuropeGeoJSON, GmGeoJSON, VrGeoJSON } from '@corona-dashboard/common';
import { FeatureCollection, MultiPolygon } from 'geojson';
import * as topojson from 'topojson-client';
import europeTopology from './geography-europe-simplified.json';
// Load all the geographical data including the data entries (regions and municipalities)
import topology from './geography-simplified.topo.json';

export const countryGeo = topojson.feature(
  topology,
  topology.objects.netherlands
) as FeatureCollection<MultiPolygon>;

export const regionGeo = topojson.feature(
  topology,
  topology.objects.vr_collection
) as VrGeoJSON;

export const gmGeo = topojson.feature(
  topology,
  topology.objects.gm_collection
) as GmGeoJSON;

export const europeGeo = topojson.feature(
  europeTopology,
  europeTopology.objects.europe
) as EuropeGeoJSON;
