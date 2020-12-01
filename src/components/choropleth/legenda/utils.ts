import { ChoroplethThresholdsValue } from '../shared';
import get from 'lodash/get';
import { assert } from 'console';

export function getDataThresholds<T>(
  thresholdData: T,
  metricName: keyof T,
  metricProperty?: string
) {
  const thresholds = metricProperty
    ? get(thresholdData, [metricName, metricProperty])
    : thresholdData[metricName];

  assert(
    thresholds,
    `No thresholds are defined for ${metricName} ${metricProperty ?? ''}`
  );

  return thresholds as ChoroplethThresholdsValue[];
}
