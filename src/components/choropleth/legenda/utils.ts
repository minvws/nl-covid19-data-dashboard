import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { ChoroplethThresholdsValue, TRegionMetricName } from '../shared';

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
  const thresholdInfo =
    (metricValueName
      ? (regionThresholds as any)?.[metricName]?.[metricValueName]
      : regionThresholds[metricName]) ?? regionThresholds[metricName];

  return thresholdInfo as ChoroplethThresholdsValue[];
}
