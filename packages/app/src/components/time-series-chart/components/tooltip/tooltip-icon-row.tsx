import { ReactNode } from 'react';
import { Box } from '~/components/base';

export function IconRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box display="flex" alignItems="stretch" spacingHorizontal={2} width="100%">
      {icon && (
        <Box
          width="1em"
          mt="2px"
          flexShrink={0}
          display="flex"
          alignItems="baseline"
          justifyContent="center"
        >
          {icon}
        </Box>
      )}
      <Box width="100%">{children}</Box>
    </Box>
  );
}
