import { TRegionMetricName, TRegionsNursingHomeMetricName } from '../../shared';
import { getSelectedThreshold } from '../utils';
import { useLegendaItems } from './useLegendaItems';

export function useSafetyRegionLegendaData(
  metric: TRegionMetricName,
  metricPropertyName?: TRegionsNursingHomeMetricName
) {
  const thresholdInfo = getSelectedThreshold(metric, metricPropertyName);
  return useLegendaItems(thresholdInfo?.thresholds);
}
