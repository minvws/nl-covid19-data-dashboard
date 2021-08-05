import { MapType } from '~/components/choropleth2';
import { CodedGeoJSON, gmGeo, inGeo, nlGeo, vrGeo } from './topology';

export type FeatureType = keyof ChoroplethFeatures;

export type ChoroplethFeatures = {
  outline?: CodedGeoJSON;
  hover: CodedGeoJSON;
  area: CodedGeoJSON;
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
