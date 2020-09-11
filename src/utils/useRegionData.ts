import { Regions } from 'types/data';
import useSWR from 'swr';
import { useMemo } from 'react';
import { SafetyRegionProperties } from 'components/vx/SafetyRegionChloropleth';
import { FeatureCollection, MultiPolygon } from 'geojson';

export type TRegionMetricName = keyof Pick<
  Regions,
  | 'hospital_admissions'
  | 'positive_tested_people'
  | 'deceased'
  | 'escalation_levels'
>;

export default function useRegionData<
  T extends TRegionMetricName,
  K extends Regions[T]
>(
  metricName: T | undefined,
  featureCollection: FeatureCollection<MultiPolygon, SafetyRegionProperties>,
  metricProperty?: string
): Record<string, K[number] & { value: number } & SafetyRegionProperties> {
  const { data } = useSWR<Regions>('/json/regions.json');

  const metricItems = metricName && data ? data[metricName] : undefined;
  metricProperty = metricProperty ?? metricName;

  return useMemo<
    Record<string, K[number] & { value: number } & SafetyRegionProperties>
  >(() => {
    if (!metricName || !metricItems) {
      return {};
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
}
