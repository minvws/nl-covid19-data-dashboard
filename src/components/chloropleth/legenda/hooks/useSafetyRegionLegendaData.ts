import { TRegionMetricName } from '../../shared';
import useSWR from 'swr';
import { Regions } from 'types/data';
import useExtent from 'utils/useExtent';

import useLegendaItems from './useLegendaItems';

export default function useSafetyRegionLegendaData(
  metric: TRegionMetricName,
  gradient: string[]
) {
  const { data } = useSWR<Regions>('/json/REGIONS.json');

  const metrics = data?.[metric];
  const domain = useExtent(metrics, (item: any) => item[metric]);

  return useLegendaItems(domain, gradient);
}
