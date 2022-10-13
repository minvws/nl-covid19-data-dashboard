import { colors } from '@corona-dashboard/common';
import { SeverityLevels } from '../types';

export const getSeverityColor = (level: SeverityLevels) => {
  switch (level) {
    case SeverityLevels.ONE:
      return colors.blue8;
    case SeverityLevels.TWO:
      return colors.scale.magenta[1];
    case SeverityLevels.THREE:
      return colors.scale.magenta[2];
    case SeverityLevels.FOUR:
      return colors.scale.magenta[3];
  }
};
