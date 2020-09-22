import { Municipalities } from 'types/data';
import { MunicipalityProperties, TMunicipalityMetricName } from '../shared';
import { FeatureCollection, MultiPolygon } from 'geojson';
import useSWR from 'swr';
import { useMemo } from 'react';

export type TGetMunicipalityFunc<T> = (
  id: string
) => T | MunicipalityProperties;

export type TMunicipalityDataInfo<T> = [TGetMunicipalityFunc<T>, boolean];

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
export function useMunicipalityData<
  T extends TMunicipalityMetricName,
  ItemType extends Municipalities[T][number],
  ReturnType extends ItemType & MunicipalityProperties & { value: number }
>(
  metricName: T | undefined,
  featureCollection: FeatureCollection<MultiPolygon, MunicipalityProperties>
): TMunicipalityDataInfo<ReturnType> {
  const { data } = useSWR<Municipalities>('/json/MUNICIPALITIES.json');

  const metricItems: ItemType[] | undefined =
    metricName && data ? (data[metricName] as ItemType[]) : undefined;

  const mergedData = useMemo(() => {
    if (!metricItems) {
      return undefined;
    }

    const filteredData = metricItems.reduce<Record<string, ReturnType>>(
      (aggr, item: ItemType): Record<string, ReturnType> => {
        const feature = featureCollection.features.find(
          (feat) => feat.properties.gemcode === item.gmcode
        );
        aggr[item.gmcode] = {
          ...item,
          ...feature?.properties,
          value: (item as any)[metricName] as number,
        } as any;
        return aggr;
      },
      {} as Record<string, ReturnType>
    );

    return filteredData;
  }, [metricItems, metricName, featureCollection]);

  const propertyData = useMemo(() => {
    return featureCollection.features.reduce<
      Record<string, MunicipalityProperties>
    >((aggr, feature) => {
      aggr[feature.properties.gemcode] = feature.properties;
      return aggr;
    }, {} as Record<string, MunicipalityProperties>);
  }, [featureCollection]);

  const getData = (id: string): ReturnType | MunicipalityProperties => {
    return mergedData ? mergedData[id] : propertyData[id];
  };

  return [
    getData,
    mergedData ? Boolean(Object.keys(mergedData).length) : false,
  ];
}
