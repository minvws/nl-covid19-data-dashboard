import {
  ChoroplethThresholds,
  TRegionMetricName,
  TRegionsNursingHomeMetricName,
} from '../../shared';

import { useLegendaItems } from './useLegendaItems';
import { regionThresholds } from '~/components/chloropleth/regionThresholds';

import { get } from 'lodash';

export function getSelectedThreshold(
  metricName?: TRegionMetricName,
  metricValueName?: string
) {
  if (!metricName) {
    return;
  }

  // Even if a metricValueName is passed in, there's not necessarily
  // a threshold defined for this. In that case we fall back to the threshold
  // that exists for the metric name.
  const thresholdInfo = metricValueName
    ? get(regionThresholds, `${metricName}.${metricValueName}`) ??
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
