import { FeatureCollection, MultiPolygon } from 'geojson';
import * as topojson from 'topojson-client';
import municipalTopology from './municipalities.topo.json';
import countryTopology from './netherlands.topo.json';
import regionTopology from './safetyregions.topo.json';

import { MunicipalGeoJOSN, RegionGeoJOSN } from './shared';

export const countryGeo = topojson.feature(
  countryTopology,
  countryTopology.objects.netherlands
) as FeatureCollection<MultiPolygon>;

export const regionGeo = topojson.feature(
  regionTopology,
  regionTopology.objects.safetyregions
) as RegionGeoJOSN;

export const municipalGeo = topojson.feature(
  municipalTopology,
  municipalTopology.objects.municipalities
) as MunicipalGeoJOSN;
