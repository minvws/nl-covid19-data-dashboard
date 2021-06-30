import { MunicipalGeoJSON, RegionGeoJSON } from '@corona-dashboard/common';
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
  topology.objects.safetyregions
) as RegionGeoJSON;

export const municipalGeo = topojson.feature(
  topology,
  topology.objects.municipalities
) as MunicipalGeoJSON;

export const europeGeo = topojson.feature(
  europeTopology,
  europeTopology.objects.europe_russia_cuttoff
) as EuropeGeoJSON;

export type EuropeGeoProperties = { ISO_A3: string };

export type EuropeGeoJSON = FeatureCollection<
  MultiPolygon,
  EuropeGeoProperties
>;
