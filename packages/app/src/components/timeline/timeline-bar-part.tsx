import { transparentize } from 'polished';
import { Box } from '../base';
import { getSeverityColor } from '../severity-indicator-tile/logic/get-severity-color';
import { SeverityLevel, SeverityLevels } from '../severity-indicator-tile/types';
import { TimelineEvent } from './timeline-event';

interface TimelineBarPartsProps {
  level: SeverityLevel;
  size: number;
  width: string;
  isLast?: boolean;
}

export const TimelineBarPart = ({ level, size = 10, width, isLast }: TimelineBarPartsProps) => {
  return (
    <Box backgroundColor={transparentize(0.7, getSeverityColor(level as SeverityLevels))} width={width}>
      <TimelineEvent level={level} isLast={isLast} size={size} />
    </Box>
  );
};
