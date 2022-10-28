import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '../base';

interface TimelineBarProps {
  height: number;
  children?: ReactNode;
}

export const TimelineBar = ({ children, height }: TimelineBarProps) => {
  return (
    <Box
      position="relative"
      style={{ height }}
      display="flex"
      alignItems="center"
    >
      <StyledTimelineBar
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        left={0}
        display="flex"
        justifyContent="space-between"
        as="ol"
      >
        {children}
      </StyledTimelineBar>
    </Box>
  );
};

const StyledTimelineBar = styled(Box)`
  list-style: none;
  margin: 0;
  padding: 0;
`;
