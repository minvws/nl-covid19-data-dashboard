import { ChoroplethThresholdsValue } from '../shared';

export function getDataThresholds<T>(
  thresholdData: T,
  metricName: keyof T,
  metricProperty?: string
) {
  // Even if a metricProperty is passed in, there's not necessarily
  // a threshold defined for this. In that case we fall back to the threshold
  // that exists for the metric name.
  const thresholdInfo =
    (metricProperty
      ? (thresholdData[metricName] as any)[metricProperty]
      : thresholdData[metricName]) ?? thresholdData[metricName];

  return thresholdInfo as ChoroplethThresholdsValue[];
}
