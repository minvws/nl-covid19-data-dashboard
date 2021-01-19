import { colors } from '~/style/theme';
import { ChoroplethThresholdsValue } from '@corona-dashboard/common';

const positiveTestedThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[0],
    threshold: 0,
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

const hospitalAdmissionsThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[0],
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 2,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 4,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 6,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 8,
  },
];

const elderlyAtHomeThresholds: ChoroplethThresholdsValue[] = [
  {
    color: '#ffffff',
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 1,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 5,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 8,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 11,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 21,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 31,
  },
];

export const municipalThresholds = {
  tested_overall: {
    infected_per_100k: positiveTestedThresholds,
  },
  hospital_nice: {
    admissions_on_date_of_reporting: hospitalAdmissionsThresholds,
  },
  elderly_at_home: elderlyAtHomeThresholds,
} as const;
