import { ChoroplethThresholdsValue } from '../shared';

export function getDataThresholds<T>(
  thresholdData: T,
  metricName: keyof T,
  metricNameValue?: string
) {
  // Even if a metricNameValue is passed in, there's not necessarily
  // a threshold defined for this. In that case we fall back to the threshold
  // that exists for the metric name.
  const thresholdInfo =
    (metricNameValue
      ? (thresholdData[metricName] as any)[metricNameValue]
      : thresholdData[metricName]) ?? thresholdData[metricName];

  return thresholdInfo as ChoroplethThresholdsValue[];
}
