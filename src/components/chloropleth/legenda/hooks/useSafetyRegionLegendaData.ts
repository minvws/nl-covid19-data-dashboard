import { TRegionMetricName } from '../../shared';
import useSWR from 'swr';
import { Regions } from 'types/data.d';
import useExtent from 'utils/useExtent';

import useLegendaItems from './useLegendaItems';

export default function useSafetyRegionLegendaData(
  metric: TRegionMetricName,
  gradient: [min: string, max: string]
) {
  const { data } = useSWR<Regions>('/json/REGIONS.json');

  const metrics = data?.[metric];
  const domain = useExtent(metrics, (item: any) => item[metric]);

  return useLegendaItems(domain, gradient);
}
