import { assert, gmData, vrData } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { MapType } from './types';

/**
 * This hook return a memoized function that will return a human readable title
 * for a specific feature based on the data associated with it.
 * A gm map will use the gemcode property and a vr map the vrcode property.
 *
 * If no customGetFeatureName method is used and an in map is being rendered
 * an error is thrown because country names need to be localized and cannot
 * simply be resolved from just the code value.
 *
 * @param map
 * @param customGetFeatureName
 * @returns
 */
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
          assert(
            isDefined(item),
            `[${useFeatureName.name}] No gm data found for gmcode ${code}`
          );
          return item.displayName ?? item.name;
        };
      }
      case 'vr': {
        return (code: string) => {
          const item = vrData.find((x) => x.code === code);
          assert(
            isDefined(item),
            `[${useFeatureName.name}] No vr data found for vrcode ${code}`
          );
          return item.name;
        };
      }
    }
  }, [map, customGetFeatureName]);
}
