import { TRegionMetricName, TRegionsNursingHomeMetricName } from '../../shared';

import { useLegendaItems } from './useLegendaItems';
import { regionThresholds } from '~/components/chloropleth/regionThresholds';

export function useSafetyRegionLegendaData(
  metric: TRegionMetricName,
  metricPropertyName?: TRegionsNursingHomeMetricName
) {
  const ths = metricPropertyName
    ? (regionThresholds[metric] as any)[metricPropertyName]
    : regionThresholds[metric];

  return useLegendaItems(ths.thresholds);
}
