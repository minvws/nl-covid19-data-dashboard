import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { DataOptions } from '..';
import { ProjectedGeoInfo } from './use-projected-coordinates';

export function useHighlightedFeature(
  geoInfo: ProjectedGeoInfo[],
  dataOptions: DataOptions
) {
  return useMemo(() => {
    if (dataOptions.highlightSelection && isDefined(dataOptions.selectedCode)) {
      return geoInfo
        .filter((x, i) => (x.code === dataOptions.selectedCode ? i : undefined))
        .map((x) => x.coordinates);
    }
  }, [geoInfo, dataOptions]);
}
