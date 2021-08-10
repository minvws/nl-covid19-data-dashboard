import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { MapType, vrBoundingBoxGmCodes } from '~/components/choropleth2/logic';
import { getVrForMunicipalityCode } from '~/utils/get-vr-for-municipality-code';
import { getVrMunicipalsForMunicipalCode } from '~/utils/get-vr-municipals-for-municipal-code';
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
        const boundingBoxGeo = filterBoundingBoxBySelectedGmCode(
          gmGeo,
          selectedCode
        );
        const hoverGeo = filterVrBySelectedGmCode(gmGeo, selectedCode);
        return {
          outline: nlGeo,
          hover: hoverGeo,
          area: boundingBoxGeo,
          boundingBox: selectedCode ? hoverGeo : nlGeo,
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

function filterBoundingBoxBySelectedGmCode(
  geoJson: CodedGeoJSON,
  selectedGmCode?: string
) {
  if (!isDefined(selectedGmCode)) {
    return geoJson;
  }
  assert(
    selectedGmCode.startsWith('GM'),
    `gm code should be be prefixed by 'GM', this code is not: ${selectedGmCode}`
  );

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

function filterVrBySelectedGmCode(
  geoJson: CodedGeoJSON,
  selectedGmCode?: string
) {
  if (!isDefined(selectedGmCode)) {
    return geoJson;
  }
  assert(
    selectedGmCode.startsWith('GM'),
    `gm code should be be prefixed by 'GM', this code is not: ${selectedGmCode}`
  );

  const gmCodes = getVrMunicipalsForMunicipalCode(selectedGmCode);
  assert(
    isDefined(gmCodes),
    `No associated municipal codes found for ${selectedGmCode}`
  );

  return {
    ...geoJson,
    features: geoJson.features.filter((x) =>
      gmCodes.includes(x.properties.code)
    ),
  };
}
