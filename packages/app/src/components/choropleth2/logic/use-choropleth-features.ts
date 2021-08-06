import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { MapType, vrBoundingBoxGmCodes } from '~/components/choropleth2/logic';
import { getVrForMunicipalityCode } from '~/utils/get-vr-for-municipality-code';
import { CodedGeoJSON, gmGeo, inGeo, nlGeo, vrGeo } from './topology';

export type FeatureType = keyof ChoroplethFeatures;

export type ChoroplethFeatures = {
  outline?: CodedGeoJSON;
  hover: CodedGeoJSON;
  area: CodedGeoJSON;
  boundingBox: CodedGeoJSON;
};

export function useChoroplethFeatures(
  map: MapType,
  selectedCode?: string
): ChoroplethFeatures {
  return useMemo(() => {
    switch (map) {
      case 'gm': {
        const filteredGeo = filterBySelectedGmCode(gmGeo, selectedCode);
        return {
          outline: nlGeo,
          hover: filteredGeo,
          area: filteredGeo,
          boundingBox: selectedCode ? filteredGeo : nlGeo,
        };
      }
      case 'vr': {
        return {
          outline: nlGeo,
          hover: vrGeo,
          area: vrGeo,
          boundingBox: nlGeo,
        };
      }
      case 'in': {
        return {
          hover: inGeo,
          area: inGeo,
          boundingBox: nlGeo,
        };
      }
    }
  }, [map, selectedCode]);
}

function filterBySelectedGmCode(
  geoJson: CodedGeoJSON,
  selectedGmCode?: string
) {
  if (!isDefined(selectedGmCode)) {
    return geoJson;
  }
  const vrInfo = getVrForMunicipalityCode(selectedGmCode);
  assert(vrInfo, `No VR found for GM code ${selectedGmCode}`);

  const viewBoxMunicipalCodes = vrBoundingBoxGmCodes[vrInfo.code];

  return {
    ...geoJson,
    features: geoJson.features.filter((x) =>
      viewBoxMunicipalCodes.includes(x.properties.code)
    ),
  };
}
