import useSWR from 'swr';
import { useMemo } from 'react';
import { Municipalities } from 'types/data';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { MunicipalityProperties } from 'components/vx/MunicipalityChloropleth';

export type TMunicipalityMetricName = keyof Pick<
  Municipalities,
  'hospital_admissions' | 'positive_tested_people' | 'deceased'
>;

export default useMunicipalityData;

/**
 * This hook return a list of municipality data where each item has a value property
 * that is set based on the given metric name.
 * When municipalCode param is defined, the result will be filtered on the safety region
 * that the given municipalCode belongs to.
 *
 * @param metricName
 * @param municipalCode
 */
function useMunicipalityData<
  T extends TMunicipalityMetricName,
  ItemType extends Municipalities[T][number],
  ReturnType extends ItemType & { value: number }
>(
  metricName: T | undefined,
  featureCollection: FeatureCollection<MultiPolygon, MunicipalityProperties>
): Record<string, ReturnType> {
  const { data } = useSWR<Municipalities>('/json/municipalities.json');

  const metricItems: ItemType[] | undefined =
    metricName && data ? (data[metricName] as ItemType[]) : undefined;

  return useMemo(() => {
    if (!metricItems) {
      return {};
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
  }, [metricItems, metricName, featureCollection.features]);
}
