import { transparentize } from 'polished';
import styled from 'styled-components';
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
  const severityColor = getSeverityColor(level as SeverityLevels);

  return (
    <Box
      as="li"
      alignItems="center"
      backgroundColor={transparentize(0.7, severityColor)}
      borderRadius={borderRadius}
      borderRight={isLast ? `2px solid ${severityColor}` : null}
      display="flex"
      width={width}
      position="relative"
    >
      <TimelineEvent level={level} isFirst={isFirst} size={size} />

      <TimelineBarPartLine color={severityColor} />
    </Box>
  );
};

const TimelineBarPartLine = styled(Box)`
  border-top: 2px solid ${({ color }) => color};
  flex: 1 0 auto;
`;
