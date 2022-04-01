import { colors } from '@corona-dashboard/common';

/**
 * This method gets the split labels for the sewerchart
 *
 */
 type labelType = {
    segment_0: string;
    segment_1: string;
    segment_2: string;
    segment_3: string;
};

export function getAverageSplitPoints(labels: labelType) {
  const averageSplitPoints = [
    {
      value: 10,
      color: colors.data.scale.blue[0],
      label: labels.segment_0,
    },
    {
      value: 50,
      color: colors.data.scale.blue[1],
      label: labels.segment_1,
    },
    {
      value: 100,
      color: colors.data.scale.blue[2],
      label: labels.segment_2,
    },
    {
      value: Infinity,
      color: colors.data.scale.blue[3],
      label: labels.segment_3,
    },
  ];

  return averageSplitPoints;
}
