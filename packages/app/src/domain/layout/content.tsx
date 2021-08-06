import { ReactNode } from 'react';
import { Box } from '~/components/base';

interface ContentProps {
  children: ReactNode;
}

export function Content({ children }: ContentProps) {
  return (
    <Box textVariant="body1" bg="white">
      <Box pt={6} pb={5} px={{ _: 3, sm: 0 }} maxWidth="maxWidthText" mx="auto">
        {children}
      </Box>
    </Box>
  );
}
