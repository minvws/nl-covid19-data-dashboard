import { ChoroplethThresholdsValue } from '@corona-dashboard/common';

/**
 * Get all the thresholds and filter out the right color that needs to be rendered in the rectangle,
 * by filtering out all the higher thresholds and then using the last key that still exists.
 */

export function getFilteredThresholdValues(
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
