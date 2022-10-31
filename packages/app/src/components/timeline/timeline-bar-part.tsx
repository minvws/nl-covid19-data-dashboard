import { transparentize } from 'polished';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '../base';

interface TimelineBarPartsProps {
  children: ReactNode;
  color: string;
  size: number;
  width: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export const TimelineBarPart = ({
  children,
  color,
  size = 10,
  width,
  isFirst = false,
  isLast = false,
}: TimelineBarPartsProps) => {
  const borderRadius = isFirst ? `${size / 2}px 0 0 ${size / 2}px` : null;

  return (
    <Box
      as="li"
      alignItems="center"
      backgroundColor={transparentize(0.7, color)}
      borderRadius={borderRadius}
      borderRight={isLast ? `2px solid ${color}` : null}
      display="flex"
      width={width}
      position="relative"
    >
      {children}

      <TimelineBarPartLine color={color} />
    </Box>
  );
};

const TimelineBarPartLine = styled(Box)`
  border-top: 2px solid ${({ color }) => color};
  flex: 1 0 auto;
`;
