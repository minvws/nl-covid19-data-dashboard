import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { MapType } from '~/components/choropleth2';
import {
  BasicGeoProperties,
  gmGeo,
  inGeo,
  NamedBasicGeoProperties,
  nlGeo,
  vrGeo,
} from './topology';

export type FeatureType = keyof ChoroplethFeatures;

export type ChoroplethFeatures = {
  outline?: FeatureCollection<MultiPolygon>;
  hover: FeatureCollection<
    MultiPolygon | Polygon,
    BasicGeoProperties | NamedBasicGeoProperties
  >;
  area: FeatureCollection<
    MultiPolygon | Polygon,
    BasicGeoProperties | NamedBasicGeoProperties
  >;
};

export function useChoroplethFeatures(map: MapType): ChoroplethFeatures {
  switch (map) {
    case 'gm': {
      return {
        outline: nlGeo,
        hover: gmGeo,
        area: gmGeo,
      };
    }
    case 'vr': {
      return {
        outline: nlGeo,
        hover: vrGeo,
        area: vrGeo,
      };
    }
    case 'in': {
      return {
        hover: inGeo,
        area: inGeo,
      };
    }
  }
}
