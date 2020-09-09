import { Regions } from 'types/data';
import useSWR from 'swr';
import { useMemo } from 'react';
import regionData from 'data';

export type TRegionMetricName = keyof Pick<
  Regions,
  'hospital_admissions' | 'positive_tested_people' | 'deceased'
>;

type TRegionDataList = typeof regionData;
type TRegionData = TRegionDataList[number];
type TRegionDataRecord = Record<string, TRegionData>;

const regionDataRecord: TRegionDataRecord = regionData.reduce(
  (aggr: TRegionDataRecord, item: TRegionData) => {
    aggr[item.code] = item;
    return aggr;
  },
  {}
);

export default function useRegionData<
  T extends TRegionMetricName,
  K extends Regions[T]
>(
  metricName?: T
): Record<string, K[number] & { value: number; regionName: string }> {
  const { data } = useSWR<Regions>('/json/regions.json');

  const metricItems = metricName && data ? data[metricName] : undefined;

  return useMemo(() => {
    if (!metricItems) {
      return [];
    }

    const filteredData = (metricItems as any[]).reduce(
      (
        aggr,
        item: K[number]
      ): Record<string, K[number] & { value: number }> => {
        aggr[item.vrcode] = {
          ...item,
          regionName: regionDataRecord[item.vrcode]?.name,
          value: (item as any)[metricName],
        };
        return aggr;
      },
      {}
    );

    return filteredData;
  }, [metricItems, metricName]);
}
