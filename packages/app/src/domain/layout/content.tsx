import { Box } from '~/components/base';
import { ReactNode } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';

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

    p: {
      fontSize: '1.125rem',
    },

    li: {
      fontSize: '1.125rem',
    },
  })
);
