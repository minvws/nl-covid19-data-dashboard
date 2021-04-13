import { Box } from '~/components-styled/base';
import { ReactNode } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
interface ContentLayoutProps {
  children: ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
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
  })
);
