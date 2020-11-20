import { useMemo } from 'react';
import useSWR from 'swr';
import {
  Municipalities,
  MunicipalitiesHospitalAdmissions,
  MunicipalitiesPositiveTestedPeople,
} from '~/types/data';
import { assert } from '~/utils/assert';
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

export function useMunicipalityData(
  metricName: TMunicipalityMetricName | undefined,
  featureCollection: MunicipalGeoJSON
) {
  const { data: municipalities } = useSWR<Municipalities>(
    '/json/MUNICIPALITIES.json'
  );

  const items =
    metricName && municipalities ? municipalities[metricName] : undefined;

  return useMemo(() => {
    const propertyData = featureCollection.features.reduce((aggr, feature) => {
      aggr[feature.properties.gemcode] = feature.properties;
      return aggr;
    }, {} as Record<string, MunicipalityProperties>);

    /**
     * cast items[] to any[] because of https://github.com/microsoft/TypeScript/issues/36390
     **/
    const mergedData = (items as any[])?.reduce<{
      [key: string]: TMunicipalityMetricType & { value: number };
    }>(
      (
        aggr,
        item:
          | MunicipalitiesHospitalAdmissions
          | MunicipalitiesPositiveTestedPeople
      ) => {
        assert(metricName, 'metricName is defined');

        const feature = featureCollection.features.find(
          (feat) => feat.properties.gemcode === item.gmcode
        );

        aggr[item.gmcode] = {
          ...item,
          ...feature?.properties,
          value: (item as any)[metricName],
        };
        return aggr;
      },
      {}
    );

    const hasData = mergedData
      ? Boolean(Object.keys(mergedData).length)
      : false;

    const getData = (id: string) =>
      mergedData ? mergedData[id] : propertyData[id];

    return [getData, hasData] as const;
  }, [items, metricName, featureCollection]);
}
