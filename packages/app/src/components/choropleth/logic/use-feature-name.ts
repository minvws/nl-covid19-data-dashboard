import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { gmData } from '~/data/gm';
import { vrData } from '~/data/vr';
import { MapType } from './types';

export function useFeatureName(
  map: MapType,
  customGetFeatureName?: (code: string) => string
) {
  return useMemo(() => {
    if (isDefined(customGetFeatureName)) {
      return customGetFeatureName;
    }
    switch (map) {
      case 'gm': {
        return (code: string) => {
          const item = gmData.find((x) => x.gemcode === code);
          assert(isDefined(item), `No gm data found for gmcode ${code}`);
          return item.displayName ?? item.name;
        };
      }
      case 'vr': {
        return (code: string) => {
          const item = vrData.find((x) => x.code === code);
          assert(isDefined(item), `No vr data found for vrcode ${code}`);
          return item.name;
        };
      }
      case 'in': {
        throw new Error(
          'International feature names are lokalized and need to be passed in using a custom getFeatureName method'
        );
      }
    }
  }, [map, customGetFeatureName]);
}
