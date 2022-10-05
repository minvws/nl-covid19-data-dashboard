import { colors } from '@corona-dashboard/common';

export type SeverityLevel = 1 | 2 | 3 | 4;

export type SeverityStep = {
  level: SeverityLevel;
  height: string;
};

export const SEVERITY_COLORS: string[] = [
  colors.blue8,
  colors.scale.magenta[1],
  colors.scale.magenta[2],
  colors.scale.magenta[3],
];

export const SEVERITY_STEPS: SeverityStep[] = [
  {
    level: 1,
    height: '50%',
  },
  {
    level: 2,
    height: '66.6%',
  },
  {
    level: 3,
    height: '83.3%',
  },
  {
    level: 4,
    height: '100%',
  },
];
