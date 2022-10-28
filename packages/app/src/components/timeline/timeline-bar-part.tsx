import { transparentize } from 'polished';
import { Box } from '../base';
import { getSeverityColor } from '../severity-indicator-tile/logic/get-severity-color';
import {
  SeverityLevel,
  SeverityLevels,
} from '../severity-indicator-tile/types';
import { TimelineEvent } from './timeline-event';

interface TimelineBarPartsProps {
  level: SeverityLevel;
  size: number;
  width: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export const TimelineBarPart = ({
  level,
  size = 10,
  width,
  isFirst = false,
  isLast = false,
}: TimelineBarPartsProps) => {
  const borderRadius = isFirst ? `${size / 2}px 0 0 ${size / 2}px` : null;

  return (
    <Box
      backgroundColor={transparentize(
        0.7,
        getSeverityColor(level as SeverityLevels)
      )}
      width={width}
      borderRadius={borderRadius}
      as="li"
    >
      <TimelineEvent level={level} isLast={isLast} size={size} />
    </Box>
  );
};
