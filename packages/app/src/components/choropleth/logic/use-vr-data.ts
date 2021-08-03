import {
  Dictionary,
  VrCollection,
  VrCollectionMetricName,
  VrGeoJSON,
  VrGeoProperties,
} from '@corona-dashboard/common';
import { set } from 'lodash';
import { useMemo } from 'react';
import { assert } from '~/utils/assert';
import { DataValue } from './use-gm-data';

interface VrMetricValue extends VrGeoProperties {
  [key: string]: unknown;
}

interface VrChoroplethValue extends VrMetricValue {
  __color_value: number | null;
}

export type GetVrDataFunctionType = (id: string) => VrChoroplethValue;

type UseVrDataReturnValue = {
  getChoroplethValue: GetVrDataFunctionType;
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

export function useVrData<K extends VrCollectionMetricName>(
  featureCollection: VrGeoJSON,
  metricName: K,
  metricProperty: string,
  data: Pick<VrCollection, K>
): UseVrDataReturnValue {
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

    const metricForAllRegions = data[metricName] as unknown as
      | VrMetricValue[]
      | undefined;

    assert(
      metricForAllRegions,
      `Missing vr_collection metric data for ${metricName}`
    );

    const propertyData = featureCollection.features.reduce(
      (acc, feature) => set(acc, feature.properties.vrcode, feature.properties),
      {} as Record<string, VrGeoProperties>
    );

    const mergedData = metricForAllRegions.reduce((acc, value) => {
      const feature = featureCollection.features.find(
        (feat) => feat.properties.vrcode === value.vrcode
      );

      if (!feature) return acc;

      const choroplethValue: VrChoroplethValue = {
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
        __color_value: value[metricProperty] as number | null,
      };

      return set(acc, value.vrcode, choroplethValue);
    }, {} as Dictionary<VrChoroplethValue>);

    const hasData = Object.keys(mergedData).length > 0;

    const getChoroplethValue = (id: string) => {
      const value = mergedData[id];
      return value || { ...propertyData[id], __color_value: 0 };
    };

    return { getChoroplethValue, hasData, values };
  }, [data, metricName, metricProperty, featureCollection.features]);
}
