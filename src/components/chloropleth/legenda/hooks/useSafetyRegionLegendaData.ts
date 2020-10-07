import { TRegionMetricName } from '../../shared';

import { useLegendaItems } from './useLegendaItems';
import { regionThresholds } from '~/components/chloropleth/regionThresholds';

export function useSafetyRegionLegendaData(metric: TRegionMetricName) {
  const ths = regionThresholds[metric];

  return useLegendaItems(ths.thresholds);
}
