import { colors } from '~/style/theme';

export const positiveTestedRiskCategoryThresholds = [
  {
    threshold: 0,
    color: colors.data.scale.magenta[0],
  },
  {
    threshold: 35,
    color: colors.data.scale.magenta[1],
  },
  {
    threshold: 100,
    color: colors.data.scale.magenta[2],
  },
  {
    threshold: 250,
    color: colors.data.scale.magenta[3],
  },
  {
    threshold: 300,
  },
];

export const hospitalAdmissionsRiskCategoryThresholds = [
  {
    threshold: 0,
    color: colors.data.scale.magenta[0],
  },
  {
    threshold: 4,
    color: colors.data.scale.magenta[1],
  },
  {
    threshold: 16,
    color: colors.data.scale.magenta[2],
  },
  {
    threshold: 27,
    color: colors.data.scale.magenta[3],
  },
  {
    threshold: 30,
  },
];
