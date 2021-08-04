import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { colors } from '~/style/theme';

const positiveTestedThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.underReported,
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 0.1,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 4,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 7,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 10,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 20,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 30,
  },
];

export const inThresholds: Record<string, ChoroplethThresholdsValue[]> = {
  infected_per_100k_average: positiveTestedThresholds,
};
