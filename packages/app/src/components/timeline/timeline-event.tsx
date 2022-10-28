import { colors } from '@corona-dashboard/common';
import { Box } from '../base';
import { getSeverityColor } from '../severity-indicator-tile/logic/get-severity-color';
import {
  SeverityLevel,
  SeverityLevels,
} from '../severity-indicator-tile/types';

interface TimelineEventProps {
  level: SeverityLevel;
  size: number;
  isLast?: boolean;
}

export const TimelineEvent = ({ level, size, isLast }: TimelineEventProps) => {
  if (isLast)
    return (
      <Box
        backgroundColor={getSeverityColor(level as SeverityLevels)}
        height={size}
        marginLeft="auto"
        width={size / 2}
      />
    );

  return (
    <Box
      backgroundColor={colors.white}
      border={`2px solid ${getSeverityColor(level as SeverityLevels)}`}
      borderRadius={`${size / 2}px`}
      height={size}
      width={size}
    />
  );
};
