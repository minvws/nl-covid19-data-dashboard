import { MunicipalityMetrics, MunicipalityData } from 'types/data';
import useSWR from 'swr';
import { useMemo } from 'react';

export type TMunicipalityMetricName = keyof MunicipalityMetrics;

export default useMunicipalityData;

/**
 * This hook return a list of municipality data where each item has a value property
 * that is set based on the given metric name.
 *
 * @param metricName
 */
function useMunicipalityData(
  metricName: TMunicipalityMetricName
): MunicipalityData[] {
  const { data } = useSWR<MunicipalityData[]>('/json/municipality-data.json');

  return useMemo(() => {
    if (!data) {
      return [];
    }

    const max = Math.min(
      ...data.map((item) => new Date(item.Date_of_report).getTime())
    );

    const filteredData = data
      .filter(
        (item) =>
          item.Municipality_code &&
          new Date(item.Date_of_report).getTime() == max
      )
      .map((item) => ({ ...item, value: item[metricName] }));

    return filteredData;
  }, [data, metricName]);
}
