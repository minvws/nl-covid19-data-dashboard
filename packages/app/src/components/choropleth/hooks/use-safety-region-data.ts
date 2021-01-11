import { set } from 'lodash';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Regions } from '~/types/data';
import { assert } from '~/utils/assert';
import {
  Dictionary,
  RegionGeoJSON,
  RegionsMetricName,
  SafetyRegionProperties,
} from '../shared';
import { DataValue } from './use-municipality-data';

interface RegionMetricValue extends SafetyRegionProperties {
  [key: string]: unknown;
}

interface RegionChoroplethValue extends RegionMetricValue {
  __color_value: number;
}

export type GetRegionDataFunctionType = (id: string) => RegionChoroplethValue;

type UseRegionDataReturnValue = {
  getChoroplethValue: GetRegionDataFunctionType;
  hasData: boolean;
  values: DataValue[];
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
  metricName: RegionsMetricName,
  metricProperty: string
): UseRegionDataReturnValue {
  const { data } = useSWR<Regions>('/json/VR_COLLECTION.json');

  return useMemo(() => {
    if (!data) {
      return {
        getChoroplethValue: (id) => ({ ...propertyData[id], __color_value: 0 }),
        hasData: false,
        values: [],
      };
    }

    const values =
      (data?.[metricName] as any[])?.map((x) => ({
        code: x.vrcode,
        value: x[metricProperty],
      })) ?? [];

    const metricForAllRegions = (data[metricName] as unknown) as
      | RegionMetricValue[]
      | undefined;

    assert(
      metricForAllRegions,
      `Missing regions metric data for ${metricName}`
    );

    const propertyData = featureCollection.features.reduce(
      (acc, feature) => set(acc, feature.properties.vrcode, feature.properties),
      {} as Record<string, SafetyRegionProperties>
    );

    const mergedData = metricForAllRegions.reduce((acc, value) => {
      const feature = featureCollection.features.find(
        (feat) => feat.properties.vrcode === value.vrcode
      );

      if (!feature) return acc;

      const choroplethValue: RegionChoroplethValue = {
        ...feature?.properties,
        /**
         * To access things like timestamps in the tooltip we simply merge all
         * metric properties in here. The result is what is passed to the
         * tooltop function.
         */
        ...value,
        /**
         * The metric value used to define the fill color in the choropleth
         */
        __color_value: Number(value[metricProperty]),
      };

      return set(acc, value.vrcode, choroplethValue);
    }, {} as Dictionary<RegionChoroplethValue>);

    const hasData = Object.keys(mergedData).length > 0;

    const getChoroplethValue = (id: string) => {
      const value = mergedData[id];
      return value || { ...propertyData[id], __color_value: 0 };
    };

    return { getChoroplethValue, hasData, values };
  }, [data, metricName, metricProperty, featureCollection.features]);
}
