import { ChoroplethThresholdsValue } from '../shared';
import { get } from 'lodash';
import { assert } from '~/utils/assert';
import { isDefined } from 'ts-is-present';

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
    `No thresholds are defined for ${[metricName, metricProperty]
      .filter(isDefined)
      .join(':')}`
  );

  return thresholds as ChoroplethThresholdsValue[];
}
