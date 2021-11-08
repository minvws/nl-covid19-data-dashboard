import type { ChoroplethThresholdsValue } from '@corona-dashboard/common';

/**
 * Get all the thresholds and retrieve the right color that needs to be rendered in the rectangle,
 * by filtering out all the higher thresholds and then returning the last threshold in the array.
 */
export function getThresholdValue(
  thresholdValues: ChoroplethThresholdsValue[],
  filterBelow: number
) {
  const filteredValues = thresholdValues.filter(
    (item: ChoroplethThresholdsValue) => {
      return item.threshold <= filterBelow;
    }
  );

  return filteredValues[filteredValues.length - 1];
}
