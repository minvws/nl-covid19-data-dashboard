import { ChoroplethThresholdsValue } from '@corona-dashboard/common';

export function getFilteredThresholdValues(
  thresholdValues: ChoroplethThresholdsValue[],
  filterBelow: number
) {
  return thresholdValues
    .filter((item: ChoroplethThresholdsValue) => {
      return item.threshold <= filterBelow;
    })
    .slice(-1)[0];
}
