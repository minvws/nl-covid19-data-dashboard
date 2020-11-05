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
  metricName: TRegionMetricName | undefined,
  featureCollection: RegionGeoJSON,
  metricProperty?: string
) {
  const { data } = useSWR<Regions>('/json/REGIONS.json');

  const items = metricName && data ? data[metricName] : undefined;
  metricProperty = metricProperty ?? metricName;

  return useMemo(() => {
    const propertyData = featureCollection.features.reduce((aggr, feature) => {
      aggr[feature.properties.vrcode] = feature.properties;
      return aggr;
    }, {} as Record<string, SafetyRegionProperties>);

    /**
     * cast items[] to any[] because of https://github.com/microsoft/TypeScript/issues/36390
     **/
    const mergedData = (items as any[])?.reduce<{
      [key: string]: TRegionMetricType & { value: number };
    }>((aggr, item) => {
      const feature = featureCollection.features.find(
        (feat) => feat.properties.vrcode === item.vrcode
      );

      aggr[item.vrcode] = {
        ...item,
        ...feature?.properties,
        value: (item as any)[metricProperty as string],
      };
      return aggr;
    }, {});

    const hasData = mergedData
      ? Boolean(Object.keys(mergedData).length)
      : false;

    const getData = (id: string) =>
      mergedData ? mergedData[id] : propertyData[id];

    return [getData, hasData] as const;
  }, [items, metricProperty, featureCollection.features]);
}
