import { FeatureCollection, MultiPolygon } from 'geojson';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Regions } from 'types/data';
import { SafetyRegionProperties, TRegionMetricName } from '../shared';

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
export default function useRegionData<
  T extends TRegionMetricName,
  K extends Regions[T],
  ReturnType extends K[number] & { value: number } & SafetyRegionProperties
>(
  metricName: T | undefined,
  featureCollection: FeatureCollection<MultiPolygon, SafetyRegionProperties>,
  metricProperty?: string
): TSafetyRegionDataInfo<ReturnType> {
  const { data } = useSWR<Regions>('/json/REGIONS.json');

  const metricItems = metricName && data ? data[metricName] : undefined;
  metricProperty = metricProperty ?? metricName;

  const mergedData = useMemo<Record<string, ReturnType>>(() => {
    if (!metricName || !metricItems) {
      return undefined;
    }

    const filteredData = (metricItems as any[]).reduce(
      (
        aggr,
        item: K[number]
      ): Record<string, K[number] & { value: number }> => {
        const feature = featureCollection.features.find(
          (feat) => feat.properties.vrcode === item.vrcode
        );

        aggr[item.vrcode] = {
          ...item,
          ...feature?.properties,
          value: (item as any)[metricProperty as string],
        };
        return aggr;
      },
      {}
    );

    return filteredData;
  }, [metricItems, metricName, metricProperty, featureCollection.features]);

  const propertyData = useMemo(() => {
    return featureCollection.features.reduce<
      Record<string, SafetyRegionProperties>
    >((aggr, feature) => {
      aggr[feature.properties.vrcode] = feature.properties;
      return aggr;
    }, {} as Record<string, SafetyRegionProperties>);
  }, [featureCollection]);

  const getData = (id: string): ReturnType | SafetyRegionProperties => {
    return mergedData ? mergedData[id] : propertyData[id];
  };

  return [
    getData,
    mergedData ? Boolean(Object.keys(mergedData).length) : false,
  ];
}
