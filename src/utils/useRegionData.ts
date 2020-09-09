import { Regions } from 'types/data';
import useSWR from 'swr';
import { useMemo } from 'react';

export type TRegionMetricName = keyof Pick<
  Regions,
  'hospital_admissions' | 'positive_tested_people' | 'deceased'
>;

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
          value: (item as any)[metricName],
        };
        return aggr;
      },
      {}
    );

    return filteredData;
  }, [metricItems, metricName]);
}
