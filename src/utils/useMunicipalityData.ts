import { MunicipalityMetrics, MunicipalityData } from 'types/data';
import useSWR from 'swr';
import { useMemo } from 'react';
import municipalCodeToRegionCodeLookup from 'data/municipalCodeToRegionCodeLookup';

export type TMunicipalityMetricName = keyof MunicipalityMetrics;

export default useMunicipalityData;

/**
 * This function take a municiaplity code and returns an array of municipality codes that
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
function useMunicipalityData(
  metricName: TMunicipalityMetricName,
  municipalCode?: string
): MunicipalityData[] {
  const { data } = useSWR<MunicipalityData[]>('/json/municipality-data.json');

  const applicableMunicipalCodes = useMemo(() => {
    return getAllMunicipalitiesForSameRegion(
      municipalCode,
      municipalCodeToRegionCodeLookup
    );
  }, [municipalCode]);

  return useMemo(() => {
    if (!data) {
      return [];
    }

    const maxDate: number = Math.max(
      ...data.map((item: MunicipalityData): number =>
        new Date(item.Date_of_report).getTime()
      )
    );

    const filterByRegionAndNewestDate = (item: MunicipalityData): boolean =>
      applicableMunicipalCodes.indexOf(item.Municipality_code) > -1 &&
      new Date(item.Date_of_report).getTime() === maxDate;

    const filterByValidDataAndNewestDate = (item: MunicipalityData): boolean =>
      Boolean(item.Municipality_code) &&
      new Date(item.Date_of_report).getTime() === maxDate;

    const activeFilter = applicableMunicipalCodes.length
      ? filterByRegionAndNewestDate
      : filterByValidDataAndNewestDate;

    const filteredData = data.filter(activeFilter).map(
      (item: MunicipalityData): MunicipalityData => ({
        ...item,
        value: item[metricName],
      })
    );

    return filteredData;
  }, [data, metricName, applicableMunicipalCodes]);
}
