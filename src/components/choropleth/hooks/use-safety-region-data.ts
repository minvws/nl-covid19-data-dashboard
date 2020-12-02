import { get, set } from 'lodash';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Regions } from '~/types/data';
import {
  RegionGeoJSON,
  SafetyRegionProperties,
  TRegionMetricName,
  TRegionMetricType,
} from '../shared';

export type TGetRegionFunc<T> = (id: string) => T | SafetyRegionProperties;

export type TSafetyRegionDataInfo<T> = [TGetRegionFunc<T>, boolean];

type RegionMetricValue = {
  vrcode: string;
  [key: string]: unknown;
};

type UseDataReturnValue = {
  getData: (id: string) => unknown;
  hasData: boolean;
};

/**
 * This hook takes a metric name, extracts the associated data from the json/regions.json
 * data file and merges these metrics with feature properties of the given featureCollection.
 *
 * A min and max domain is calculated based on the specified metric.
 *
 * When no metricName is provided only the feature properties are used.
 *
 * It returns a function that returns the merged data given a valid region code, as wel
 * as a noData indicator along with the generated domain.
 *
 * @param metricName
 * @param featureCollection
 * @param metricProperty
 */

export function useSafetyRegionData(
  featureCollection: RegionGeoJSON,
  metricName: TRegionMetricName,
  metricProperty?: string
): UseDataReturnValue {
  const { data } = useSWR<Regions>('/json/REGIONS.json');

  return useMemo(() => {
    if (!data) {
      return {
        getData: () => 0,
        hasData: false,
      };
    }

    const values = data[metricName];

    const propertyData = featureCollection.features.reduce(
      (acc, feature) => set(acc, feature.properties.vrcode, feature.properties),
      {} as Record<string, SafetyRegionProperties>
    );

    /**
     * Cast to unknown because of https://github.com/microsoft/TypeScript/issues/36390
     **/
    const mergedData = ((values as unknown) as RegionMetricValue[]).reduce(
      (acc, value) => {
        const feature = featureCollection.features.find(
          (feat) => feat.properties.vrcode === value.vrcode
        );

        return set(acc, value.vrcode, {
          ...feature?.properties,
          value: metricProperty
            ? get(value, [metricName, metricProperty])
            : value[metricName],
        });
      },
      {} as Record<string, TRegionMetricType & { value: unknown }>
    );

    const hasData = Object.keys(mergedData).length > 0;

    const getData = (id: string) =>
      hasData ? mergedData[id] : propertyData[id];

    return { getData, hasData };
  }, [data, metricName, metricProperty, featureCollection.features]);
}
