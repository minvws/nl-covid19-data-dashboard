import { useMemo } from 'react';
import useSWR from 'swr';

import { Regions } from 'types/data';

export type TRegionMetricName = keyof Pick<
  Regions,
  'hospital_admissions' | 'positive_tested_people' | 'deceased'
>;

/**
 * This hook filters the regional chloropleth data based on the given metric name
 *
 * @param metricName The given metric name
 */
export default function useRegionData<
  T extends TRegionMetricName,
  K extends Regions[T]
>(metricName: T, regionCode?: string): (K[number] & { value: number })[] {
  const { data } = useSWR<Regions>('/json/regions.json');

  const metricItems = data?.[metricName];

  return useMemo(() => {
    if (!metricItems) {
      return [];
    }

    const filteredData = (metricItems as any[]).map<
      K[number] & { value: number }
    >((item: K[number]): K[number] & { value: number } => ({
      ...item,
      value: (item as any)[metricName],
    }));

    const filterByRegion: any = (item: K[number]): any =>
      item.vrcode === regionCode;

    return regionCode ? filteredData.filter<any>(filterByRegion) : filteredData;
  }, [metricItems, metricName, regionCode]);
}
