import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { getVrMunicipalsForMunicipalCode } from '~/utils/get-vr-municipals-for-municipal-code';
import { ChoroplethDataItem, GmDataItem, MapType } from './types';
import { isGmData } from './utils';

export function useChoroplethData<T extends ChoroplethDataItem>(
  data: T[],
  map: MapType,
  selectedCode?: string
) {
  return useMemo(() => {
    if (map === 'gm' && isDefined(selectedCode)) {
      const gmCodes = getVrMunicipalsForMunicipalCode(selectedCode);
      assert(isDefined(gmCodes), `No VR GM codes for GM code ${selectedCode}`);
      return data
        .filter(isGmData)
        .filter((x) => gmCodes.includes((x as GmDataItem).gmcode));
    }
    return data;
  }, [data, map, selectedCode]);
}
