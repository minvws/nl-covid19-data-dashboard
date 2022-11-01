import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';

interface TimelineBarProps {
  children: ReactNode;
  height: number;
}

export const TimelineBar = ({ children, height }: TimelineBarProps) => {
  return (
    <Box alignItems="center" css={css({ userSelect: 'none', touchAction: 'pan-y' })} display="flex" height={height}>
      <StyledTimelineBar as="ol" display="flex" height={height} justifyContent="space-between" width="100%">
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
