import { Box } from '~/components-styled/base';
import { ReactNode } from 'react';

interface ContentLayoutProps {
  children: ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <Box bg="white">
      <Box pb={5} pt={6} px={{ _: 3, sm: 0 }} maxWidth="contentWidth" mx="auto">
        {children}
      </Box>
    </Box>
  );
}
