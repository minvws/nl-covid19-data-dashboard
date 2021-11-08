import { colors, NlRiskLevelValue } from '@corona-dashboard/common';

export type EscalationLevelType = NlRiskLevelValue['risk_level'];

export const escalationColors = [
  {
    color: colors.data.scale.magenta[0],
    level: 1,
  },
  {
    color: colors.data.scale.magenta[1],
    level: 2,
  },
  {
    color: colors.data.scale.magenta[2],
    level: 3,
  },
];
