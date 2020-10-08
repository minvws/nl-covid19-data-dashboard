import {
  ChoroplethThresholds,
  TRegionMetricName,
  TRegionsNursingHomeMetricName,
} from '../../shared';

import { useLegendaItems } from './useLegendaItems';
import { regionThresholds } from '~/components/chloropleth/regionThresholds';

import get from 'lodash.get';

export function getSelectedThreshold(
  metricName?: TRegionMetricName,
  metricPropertyName?: string
) {
  if (!metricName) {
    return undefined;
  }

  const thresholdInfo = metricPropertyName
    ? get(regionThresholds, `${metricName}.${metricPropertyName}`) ??
      regionThresholds[metricName]
    : regionThresholds[metricName];

  return thresholdInfo as ChoroplethThresholds;
}

export function useSafetyRegionLegendaData(
  metric: TRegionMetricName,
  metricPropertyName?: TRegionsNursingHomeMetricName
) {
  const thresholdInfo = getSelectedThreshold(metric, metricPropertyName);
  return useLegendaItems(thresholdInfo?.thresholds);
}
