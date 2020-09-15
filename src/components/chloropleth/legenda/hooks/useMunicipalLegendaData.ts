import { TMunicipalityMetricName } from 'components/chloropleth/shared';
import useSWR from 'swr';
import { Municipalities } from 'types/data';
import useExtent from 'utils/useExtent';

import useLegendaItems from './useLegendaItems';

export default function useMunicipalLegendaData(
  metric: TMunicipalityMetricName,
  gradient: [min: string, max: string]
) {
  const { data } = useSWR<Municipalities>('/json/MUNICIPALITIES.json');

  const metrics = data?.[metric];
  const domain = useExtent(metrics, (item: any) => item[metric]);

  return useLegendaItems(domain, gradient);
}
