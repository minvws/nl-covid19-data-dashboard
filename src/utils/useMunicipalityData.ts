import useSWR from 'swr';
import { useMemo } from 'react';
import municipalCodeToRegionCodeLookup from 'data/municipalCodeToRegionCodeLookup';
import { Municipalities } from 'types/data';

export type TMunicipalityMetricName = keyof Pick<
  Municipalities,
  'hospital_admissions' | 'positive_tested_people' | 'deceased'
>;

export default useMunicipalityData;

/**
 * This function take a municipality code and returns an array of municipality codes that
 * all belong to the same region as the given code belongs to.
 *
 * @param code
 * @param municipalCodeToRegionCode
 */
function getAllMunicipalitiesForSameRegion(
  code: string | undefined,
  municipalCodeToRegionCode: any
): string[] {
  if (!code) {
    return [];
  }

  const regionCode = municipalCodeToRegionCode[code];

  return Object.keys(municipalCodeToRegionCode).filter(
    (code) => municipalCodeToRegionCode[code] === regionCode
  );
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
>(metricName: T, municipalCode?: string): (K[number] & { value: number })[] {
  const { data } = useSWR<Municipalities>('/json/municipalities.json');

  const metricItems = data?.[metricName];

  const applicableMunicipalCodes = useMemo(() => {
    return getAllMunicipalitiesForSameRegion(
      municipalCode,
      municipalCodeToRegionCodeLookup
    );
  }, [municipalCode]);

  return useMemo(() => {
    if (!metricItems) {
      return [];
    }

    const filterByRegion: any = (item: K[number]): any =>
      applicableMunicipalCodes.indexOf(item.gmcode) > -1;

    const filteredData = (metricItems as any[]).map<
      K[number] & { value: number }
    >((item: K[number]): K[number] & { value: number } => ({
      ...item,
      value: (item as any)[metricName],
    }));

    return applicableMunicipalCodes.length
      ? filteredData.filter<any>(filterByRegion)
      : filteredData;
  }, [metricItems, metricName, applicableMunicipalCodes]);
}
