import { colors } from '~/style/theme';

/**
 * @TODO remove when we have this avaliable in the schemas
 */
export type EscalationLevelType = 1 | 2 | 3;

export const escalationThresholds = [
  {
    color: colors.data.scale.magenta[0],
    threshold: 1,
  },
  {
    color: colors.data.scale.magenta[1],
    threshold: 2,
  },
  {
    color: colors.data.scale.magenta[2],
    threshold: 3,
  },
];
