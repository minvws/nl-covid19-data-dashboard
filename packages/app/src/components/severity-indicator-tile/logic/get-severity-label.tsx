import { SeverityLevels } from '../types';

export const getSeverityLabel = (level: SeverityLevels) => {
  switch (level) {
    case SeverityLevels.ONE:
      return 'Laag';
    case SeverityLevels.TWO:
      return 'Verhoogd';
    case SeverityLevels.THREE:
      return 'Hoog';
    case SeverityLevels.FOUR:
      return 'Zeer hoog';
  }
};
