import get from 'lodash/get';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { ChoroplethThresholdsValue, TRegionMetricName } from '../shared';

export function getSelectedThreshold(
  metricName?: TRegionMetricName,
  metricValueName?: string
) {
  const threshold: ChoroplethThresholdsValue[] | undefined =
    get(regionThresholds, `${metricName}.${metricValueName})`) ||
    get(regionThresholds, `${metricName}`);

  return threshold;
}
