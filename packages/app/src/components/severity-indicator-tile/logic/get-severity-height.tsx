import { SeverityLevels } from '../types';

export const getSeverityHeight = (level: SeverityLevels) => {
  switch (level) {
    case SeverityLevels.ONE:
      return '50%';
    case SeverityLevels.TWO:
      return '66.6%';
    case SeverityLevels.THREE:
      return '83.3%';
    case SeverityLevels.FOUR:
      return '100%';
  }
};
