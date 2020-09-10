import { Regions } from 'types/data';
import useSWR from 'swr';
import { useMemo } from 'react';
import { SafetyRegionProperties } from 'components/vx/SafetyRegionChloropleth';
import { FeatureCollection, MultiPolygon } from 'geojson';

export type TRegionMetricName = keyof Pick<
  Regions,
  'hospital_admissions' | 'positive_tested_people' | 'deceased'
>;

export default function useRegionData<
  T extends TRegionMetricName,
  K extends Regions[T]
>(
  metricName: T | undefined,
  featureCollection: FeatureCollection<MultiPolygon, SafetyRegionProperties>
): Record<string, K[number] & { value: number } & SafetyRegionProperties> {
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
        const feature = featureCollection.features.find(
          (feat) => feat.properties.vrcode === item.vrcode
        );

        aggr[item.vrcode] = {
          ...item,
          ...feature?.properties,
          value: (item as any)[metricName],
        };
        return aggr;
      },
      {}
    );

    return filteredData;
  }, [metricItems, metricName]);
}
