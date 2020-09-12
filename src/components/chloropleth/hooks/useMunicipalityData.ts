import { Municipalities } from 'types/data';
import { MunicipalityProperties, TMunicipalityMetricName } from '../shared';
import { FeatureCollection, MultiPolygon } from 'geojson';
import useSWR from 'swr';
import { useMemo } from 'react';
import useExtent from 'utils/useExtent';

export type TGetMunicipalityFunc<T> = (
  id: string
) => T | MunicipalityProperties;

export type TMunicipalityDataInfo<T> = [
  TGetMunicipalityFunc<T>,
  boolean,
  [min: number, max: number] | undefined
];

export default function useMunicipalityData<
  T extends TMunicipalityMetricName,
  ItemType extends Municipalities[T][number],
  ReturnType extends ItemType & MunicipalityProperties & { value: number }
>(
  metricName: T | undefined,
  featureCollection: FeatureCollection<MultiPolygon, MunicipalityProperties>
): TMunicipalityDataInfo<ReturnType> {
  const { data } = useSWR<Municipalities>('/json/municipalities.json');

  const metricItems: ItemType[] | undefined =
    metricName && data ? (data[metricName] as ItemType[]) : undefined;

  const domain = useExtent(metricItems, (item: any) => item[metricName]);

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
    domain,
  ];
}
