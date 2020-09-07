import useSWR from 'swr';
import { useMemo } from 'react';
import { Municipalities } from 'types/data';

export type TMunicipalityMetricName = keyof Pick<
  Municipalities,
  'hospital_admissions' | 'positive_tested_people' | 'deceased'
>;

export default useMunicipalityData;

function createMunicipalCodeFilter<T extends { gmcode: string }>(
  municipalCodes?: string[]
) {
  if (municipalCodes) {
    return (item: T): boolean => municipalCodes.indexOf(item.gmcode) > -1;
  }
  return (_item: T): boolean => true;
}

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
>(
  metricName?: T,
  municipalCodes?: string[]
): (K[number] & { value: number })[] {
  const { data } = useSWR<Municipalities>('/json/municipalities.json');

  const metricItems = metricName ? data?.[metricName] : undefined;

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

    return filteredData.filter(
      createMunicipalCodeFilter<K[number] & { value: number }>(municipalCodes)
    );
  }, [metricItems, metricName, municipalCodes]);
}
