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
  isFirst?: boolean;
}

export const TimelineEvent = ({ level, size, isFirst }: TimelineEventProps) => {
  return (
    <Box
      backgroundColor={colors.white}
      border={`2px solid ${getSeverityColor(level as SeverityLevels)}`}
      borderRadius={`${size / 2}px`}
      height={size}
      width={size}
      position="absolute"
      left={!isFirst ? `-${size / 2}px` : null}
    />
  );
};
