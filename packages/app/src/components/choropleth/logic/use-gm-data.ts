import {
  Dictionary,
  GmCollection,
  GmCollectionMetricName,
  GmGeoJSON,
  GmGeoProperties,
} from '@corona-dashboard/common';
import { set } from 'lodash';
import { useMemo } from 'react';
import { assert } from '~/utils/assert';

/**
 * This hook takes a metric name, extracts the associated data from the json/municipalities.json
 * data file and merges these metrics with feature properties of the given featureCollection.
 *
 * A min and max domain is calculated based on the specified metric.
 *
 * When no metricName is provided only the feature properties are used.
 *
 * It returns a function that returns the merged data given a valid municipal code, as wel
 * as a noData indicator along with the generated domain.
 *
 * @param metricName
 * @param featureCollection
 */

interface GmMetricValue extends GmGeoProperties {
  [key: string]: unknown;
}

interface GmChoroplethValue extends GmMetricValue {
  __color_value: number;
}

export type GetGmDataFunctionType = (id: string) => GmChoroplethValue;

export type DataValue = {
  value: number;
  code: string;
};

type UseGmDataReturnValue = {
  getChoroplethValue: GetGmDataFunctionType;
  hasData: boolean;
  values: DataValue[];
};

export function useGmNavigationData(
  featureCollection: GmGeoJSON
): UseGmDataReturnValue {
  const propertyData = featureCollection.features.reduce(
    (acc, feature) => set(acc, feature.properties.gemcode, feature.properties),
    {} as Record<string, GmGeoProperties>
  );

  return {
    getChoroplethValue: (id: string) => ({
      ...propertyData[id],
      gmcode: propertyData[id].gmcode || propertyData[id].gemcode,
      __color_value: 0,
    }),
    hasData: true,
    values: [],
  };
}

export function useGmData<K extends GmCollectionMetricName>(
  featureCollection: GmGeoJSON,
  metricName: K,
  metricProperty: string,
  data: Pick<GmCollection, K>
): UseGmDataReturnValue {
  return useMemo(() => {
    const propertyData = featureCollection.features.reduce(
      (acc, feature) =>
        set(acc, feature.properties.gemcode, feature.properties),
      {} as Record<string, GmGeoProperties>
    );

    if (!data) {
      return {
        getChoroplethValue: (id) => ({
          ...propertyData[id],
          __color_value: 0,
        }),
        hasData: false,
        values: [],
      };
    }

    const values =
      (data?.[metricName] as any[])?.map((x) => ({
        code: x.gmcode,
        value: x[metricProperty],
      })) ?? [];

    const metricsForAllMunicipalities = data[metricName] as unknown as
      | GmMetricValue[]
      | undefined;

    assert(
      metricsForAllMunicipalities,
      `Missing municipality metric data for ${metricName}`
    );

    const mergedData = metricsForAllMunicipalities.reduce((acc, value) => {
      const feature = featureCollection.features.find(
        (feat) => feat.properties.gemcode === value.gmcode
      );

      if (!feature) return acc;

      return set(acc, value.gmcode, {
        ...feature.properties,
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
      });
    }, {} as Dictionary<GmChoroplethValue>);

    const hasData = Object.keys(mergedData).length > 0;

    const getChoroplethValue = (id: string) => {
      const value = mergedData[id];
      return value || { ...propertyData[id], __color_value: 0 };
    };

    return { getChoroplethValue, hasData, values };
  }, [data, metricName, metricProperty, featureCollection]);
}
