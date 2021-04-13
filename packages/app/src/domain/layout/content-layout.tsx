import { Box } from '~/components-styled/base';
import { ReactNode } from 'react';

interface ContentLayoutProps {
  children: ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <Box bg="white">
      <Box pt={6} pb={5} px={{ _: 3, sm: 0 }} maxWidth="maxWidthText" mx="auto">
        {children}
      </Box>
    </Box>
  );
}
