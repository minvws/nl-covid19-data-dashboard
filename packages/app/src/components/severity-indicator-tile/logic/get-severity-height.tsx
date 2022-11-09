import { SeverityLevel } from '../types';
import { SEVERITY_LEVELS_LIST } from '../constants';

const MIN_SEVERITY_HEIGHT = 50; // 50% of the total height of the severity indicator.

export const getSeverityHeight = (level: SeverityLevel) => {
  const maxSeverityLevel = Math.max(...SEVERITY_LEVELS_LIST);
  const heightStep = MIN_SEVERITY_HEIGHT / maxSeverityLevel;

  return MIN_SEVERITY_HEIGHT + heightStep * (level - 1);
};
