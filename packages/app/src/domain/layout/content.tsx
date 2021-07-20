import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';

interface ContentProps {
  children: ReactNode;
}

export function Content({ children }: ContentProps) {
  return (
    <StyledBox>
      <Box pt={6} pb={5} px={{ _: 3, sm: 0 }} maxWidth="maxWidthText" mx="auto">
        {children}
      </Box>
    </StyledBox>
  );
}

const StyledBox = styled(Box)(
  css({
    bg: 'white',
    fontSize: '1.125rem',
  })
);
