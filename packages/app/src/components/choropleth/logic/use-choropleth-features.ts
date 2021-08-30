import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { feature as topojsonFeature } from 'topojson-client';
import { isDefined } from 'ts-is-present';
import { MapType, vrBoundingBoxGmCodes } from '~/components/choropleth/logic';
import { getVrForMunicipalityCode } from '~/utils/get-vr-for-municipality-code';
import { getVrMunicipalsForMunicipalCode } from '~/utils/get-vr-municipals-for-municipal-code';
import { CodedGeoJSON, gmGeo } from './topology';
import { ChoroplethDataItem } from './types';

export type FeatureType = keyof ChoroplethFeatures;

const useSWROptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
};

/**
 * These country codes represent the outer most features of the international
 * map that need to be centered in on. So, roughly the top left, top right
 * bottom left and bottom right features.
 */
const internationalBoundingBoxCodes = ['ISL', 'NOR', 'ESP', 'GRC', 'CYP'];

export type ChoroplethFeatures = {
  outline?: CodedGeoJSON;
  hover: CodedGeoJSON;
  area: CodedGeoJSON;
  boundingBox: CodedGeoJSON;
};

export function useChoroplethFeatures<T extends ChoroplethDataItem>(
  map: MapType,
  data: T[],
  selectedCode?: string
): ChoroplethFeatures | undefined {
  const { data: geoJson } = useSWR<
    readonly [CodedGeoJSON, CodedGeoJSON | undefined]
  >(
    `/api/topo-json/${map}`,
    (url) =>
      fetch(url)
        .then((_) => _.json())
        .then((_) => createGeoJson(map, _)),
    useSWROptions
  );
  if (!isDefined(geoJson)) {
    mutate(`/api/topo-json/${map}`);
  }

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
      assert(isDefined(outlineGeo), 'outlineGeo is required for map type gm');
      const surroundingGeo = filterSurroundingFeaturesBySelectedGmCode(
        featureGeo,
        selectedCode
      );
      const hoverGeo = filterVrBySelectedGmCode(gmGeo, selectedCode);
      return {
        outline: outlineGeo,
        hover: hoverGeo,
        area: surroundingGeo,
        boundingBox: hoverGeo,
      };
    }
    case 'vr': {
      assert(isDefined(outlineGeo), 'outlineGeo is required for map type vr');
      return {
        outline: outlineGeo,
        hover: featureGeo,
        area: featureGeo,
        boundingBox: outlineGeo,
      };
    }
    case 'in': {
      const inData = (data as unknown[]).filter(function (
        v: any
      ): v is { country_code: string } {
        return 'country_code' in v;
      });
      return {
        outline: {
          ...featureGeo,
          features: featureGeo.features.filter(
            (x) => !inData.some((d) => d.country_code === x.properties.code)
          ),
        },
        hover: {
          ...featureGeo,
          features: featureGeo.features.filter((x) =>
            inData.some((d) => d.country_code === x.properties.code)
          ),
        },
        area: featureGeo,
        boundingBox: {
          ...featureGeo,
          features: featureGeo.features.filter((x) =>
            internationalBoundingBoxCodes.includes(x.properties.code)
          ),
        },
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

function createGeoJson(map: MapType, topoJson: any) {
  const outlineGeo =
    map === 'in'
      ? undefined
      : (topojsonFeature(
          topoJson,
          topoJson.objects.nl_features
        ) as CodedGeoJSON);

  const featureGeo = topojsonFeature(
    topoJson,
    topoJson.objects[`${map}_features`]
  ) as CodedGeoJSON;

  return [featureGeo, outlineGeo] as const;
}
