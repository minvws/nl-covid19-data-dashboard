import useSWR from 'swr';
import { useMemo } from 'react';
import { Municipalities } from 'types/data';

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
  K extends Municipalities[T]
>(metricName?: T): Record<string, K[number] & { value: number }> {
  const { data } = useSWR<Municipalities>('/json/municipalities.json');

  const metricItems = metricName ? data?.[metricName] : undefined;

  return useMemo(() => {
    if (!metricItems) {
      return {};
    }

    const filteredData = (metricItems as any[]).reduce(
      (
        aggr,
        item: K[number]
      ): Record<string, K[number] & { value: number }> => {
        aggr[item.gmcode] = {
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
