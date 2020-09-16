import { TRegionMetricName } from '../../shared';

import useLegendaItems from './useLegendaItems';
import { thresholds } from 'components/chloropleth/SafetyRegionChloropleth';

export default function useSafetyRegionLegendaData(metric: TRegionMetricName) {
  const ths = thresholds[metric];

  return useLegendaItems(ths.thresholds);
}
