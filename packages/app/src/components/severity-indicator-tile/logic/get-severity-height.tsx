import { SeverityLevels } from '../types';

const MIN_SEVERITY_HEIGHT = 50; // 50% of the total height of the severity indicator.

export const getSeverityHeight = (level: SeverityLevels) => {
  const maxSeverityLevel = Object.values(SeverityLevels)
    .map((level) => Number(level))
    .sort((numberA, numberB) => numberA - numberB)[
    Object.keys(SeverityLevels).length - 1
  ];

  const heightStep = MIN_SEVERITY_HEIGHT / maxSeverityLevel;

  return MIN_SEVERITY_HEIGHT + heightStep * (Number(level) - 1);
};
