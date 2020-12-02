import { get, set } from 'lodash';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Municipalities } from '~/types/data';
import {
  MunicipalGeoJSON,
  MunicipalityProperties,
  TMunicipalityMetricName,
  TMunicipalityMetricType,
} from '../shared';

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

type MunicipalitiesMetricValue = {
  gmcode: string;
  [key: string]: unknown;
};

type UseDataReturnValue = {
  getData: (id: string) => unknown;
  hasData: boolean;
};

export function useMunicipalityNavigationData(
  featureCollection: MunicipalGeoJSON
): UseDataReturnValue {
  const { data: municipalities } = useSWR<Municipalities>(
    '/json/MUNICIPALITIES.json'
  );

  if (!municipalities) {
    return {
      getData: () => 0,
      hasData: false,
    };
  }

  const propertyData = featureCollection.features.reduce(
    (acc, feature) => set(acc, feature.properties.gemcode, feature.properties),
    {} as Record<string, MunicipalityProperties>
  );

  return {
    getData: (id: string) => propertyData[id],
    hasData: true,
  };
}

export function useMunicipalityData(
  featureCollection: MunicipalGeoJSON,
  metricName: TMunicipalityMetricName,
  metricProperty?: string
): UseDataReturnValue {
  const { data } = useSWR<Municipalities>('/json/MUNICIPALITIES.json');

  // assert(municipalities, 'Missing municipalities data');

  return useMemo(() => {
    if (!data) {
      return {
        getData: () => 0,
        hasData: false,
      };
    }

    const values = data[metricName];
    const propertyData = featureCollection.features.reduce(
      (acc, feature) =>
        set(acc, feature.properties.gemcode, feature.properties),
      {} as Record<string, MunicipalityProperties>
    );

    /**
     * Cast values to unknown because of https://github.com/microsoft/TypeScript/issues/36390
     **/
    const mergedData = ((values as unknown) as Array<
      MunicipalitiesMetricValue
    >).reduce((acc, value) => {
      const feature = featureCollection.features.find(
        (feat) => feat.properties.gemcode === value.gmcode
      );

      return set(acc, value.gmcode, {
        ...feature?.properties,
        value: metricProperty
          ? get(value, [metricName, metricProperty])
          : value[metricName],
      });
    }, {} as Record<string, TMunicipalityMetricType & { value: unknown }>);

    const hasData = Object.keys(mergedData).length > 0;

    const getData = (id: string) =>
      mergedData ? mergedData[id] : propertyData[id];

    return { getData, hasData };
  }, [data, metricName, metricProperty, featureCollection]);
}
