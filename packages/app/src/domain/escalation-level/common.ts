import { colors } from '@corona-dashboard/common';

/**
 * @TODO remove when we have this available in the schemas
 */
export type EscalationLevelType = 1 | 2 | 3;

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
