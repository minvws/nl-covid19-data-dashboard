import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { space } from '~/style/theme';

interface ContentProps {
  children: ReactNode;
}

export function Content({ children }: ContentProps) {
  return (
    <Box textVariant="body1" bg="white">
      <Box paddingTop={space[6]} paddingBottom={space[5]} paddingX={{ _: space[3], sm: '0' }} maxWidth="maxWidthText" marginX="auto">
        {children}
      </Box>
    </Box>
  );
}
