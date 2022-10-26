import { colors } from '@corona-dashboard/common';
import { Box } from '../base';
import { getSeverityColor } from '../severity-indicator-tile/logic/get-severity-color';
import { SeverityLevel, SeverityLevels } from '../severity-indicator-tile/types';

interface TimelineEventProps {
  level: SeverityLevel;
  size: number;
  isLast?: boolean;
}

export const TimelineEvent = ({ level, size, isLast }: TimelineEventProps) => {
  return (
    <Box
      backgroundColor={colors.white}
      border={`2px solid ${getSeverityColor(level as SeverityLevels)}`}
      borderRadius={!isLast ? `${size / 2}px` : null}
      width={isLast ? size / 2 : size}
      height={size}
    />
  );
};
