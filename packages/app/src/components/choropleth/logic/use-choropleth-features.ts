import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { feature as topojsonFeature } from 'topojson-client';
import { isDefined } from 'ts-is-present';
import { MapType, vrBoundingBoxGmCodes } from '~/components/choropleth/logic';
import { getVrForMunicipalityCode } from '~/utils/get-vr-for-municipality-code';
import { getVrGmCodesForGmCode } from '~/utils/get-vr-gm-codes-for-gm-code';
import type { ChoroplethDataItem, CodedGeoJSON } from './types';

export type FeatureType = keyof ChoroplethFeatures;

export type ChoroplethFeatures = {
  outline?: CodedGeoJSON;
  hover: CodedGeoJSON;
  area: CodedGeoJSON;
  boundingBox: CodedGeoJSON;
};

/**
 * This hook returns the appropriate GEOJson data for the given map type.
 * The data is being loaded from the /api/topo-json API route.
 *
 * @param map The given map type
 * @param data Map data, only used for the European map features
 * @param selectedCode An optional selected code, this will be used to determine the bounding box
 * @returns The GEOJson data
 */
export function useChoroplethFeatures<T extends ChoroplethDataItem>(
  map: MapType,
  data: T[],
  selectedCode?: string
): ChoroplethFeatures | undefined {
  const { data: geoJson } = useSWRImmutable<
    readonly [CodedGeoJSON, CodedGeoJSON | undefined]
  >(`/api/topo-json/${map}`, (url: string) =>
    fetch(url)
      .then((_) => _.json())
      .then((_) => createGeoJson(map, _))
  );

  return useMemo(() => {
    if (!isDefined(geoJson)) {
      return;
    }

    return getChoroplethFeatures(map, data, geoJson, selectedCode);
  }, [map, selectedCode, data, geoJson]);
}

export function getChoroplethFeatures<T extends ChoroplethDataItem>(
  map: MapType,
  data: T[],
  geoJson: readonly [CodedGeoJSON, CodedGeoJSON | undefined],
  selectedCode?: string
) {
  const [featureGeo, outlineGeo] = geoJson;

  switch (map) {
    case 'gm': {
      assert(
        isDefined(outlineGeo),
        `[${getChoroplethFeatures.name}] outlineGeo is required for map type gm`
      );
      const surroundingGeo = filterSurroundingFeaturesBySelectedGmCode(
        featureGeo,
        selectedCode
      );
      const hoverGeo = filterVrBySelectedGmCode(featureGeo, selectedCode);
      return {
        outline: outlineGeo,
        hover: hoverGeo,
        area: surroundingGeo,
        boundingBox: hoverGeo,
      };
    }
    case 'vr': {
      assert(
        isDefined(outlineGeo),
        `[${getChoroplethFeatures.name}] outlineGeo is required for map type vr`
      );
      return {
        outline: outlineGeo,
        hover: featureGeo,
        area: featureGeo,
        boundingBox: outlineGeo,
      };
    }
  }
}

function filterSurroundingFeaturesBySelectedGmCode(
  geoJson: CodedGeoJSON,
  selectedGmCode?: string
) {
  if (!isDefined(selectedGmCode)) {
    return geoJson;
  }
  assert(
    selectedGmCode.startsWith('GM'),
    `[${filterSurroundingFeaturesBySelectedGmCode.name}] gm code should be be prefixed by 'GM', this code is not: ${selectedGmCode}`
  );

  const vrInfo = getVrForMunicipalityCode(selectedGmCode);
  assert(
    vrInfo,
    `[${filterSurroundingFeaturesBySelectedGmCode.name}] No VR found for GM code ${selectedGmCode}`
  );

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
    `[${filterVrBySelectedGmCode.name}] gm code should be be prefixed by 'GM', this code is not: ${selectedGmCode}`
  );

  const gmCodes = getVrGmCodesForGmCode(selectedGmCode);
  assert(
    isDefined(gmCodes),
    `[${filterVrBySelectedGmCode.name}] No associated municipal codes found for ${selectedGmCode}`
  );

  return {
    ...geoJson,
    features: geoJson.features.filter((x) =>
      gmCodes.includes(x.properties.code)
    ),
  };
}

function createGeoJson(map: MapType, topoJson: any) {
  const outlineGeo = topojsonFeature(
    topoJson,
    topoJson.objects.nl_features
  ) as CodedGeoJSON;

  const featureGeo = topojsonFeature(
    topoJson,
    topoJson.objects[`${map}_features`]
  ) as CodedGeoJSON;

  return [featureGeo, outlineGeo] as const;
}
