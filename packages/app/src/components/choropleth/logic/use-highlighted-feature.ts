import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { DataOptions } from '..';
import { GeoInfo } from './use-projected-coordinates';

export function useHighlightedFeature(
  geoInfo: GeoInfo[],
  projectedCoordinates: [number, number][][],
  dataOptions: DataOptions
) {
  return useMemo(() => {
    if (dataOptions.highlightSelection && isDefined(dataOptions.selectedCode)) {
      const featureIndexes = geoInfo
        .map((x, i) => (x.code === dataOptions.selectedCode ? i : undefined))
        .filter(isDefined);
      return projectedCoordinates.filter((_x, i) => featureIndexes.includes(i));
    }
  }, [geoInfo, projectedCoordinates, dataOptions]);
}
