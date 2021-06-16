import { transparentize } from 'polished';
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { colors } from '~/style/theme';

interface TimelineProps {
  children: ReactNode;
  width: number;
  height: number;
}

export function Timeline({ children, width, height }: TimelineProps) {
  return (
    <Box
      position="relative"
      bg={transparentize(0.9, colors.data.primary)}
      style={{
        width,
        height,
      }}
      display="flex"
      alignItems="center"
    >
      <Box height="1px" width={width} bg={colors.data.primary} />
      <Box position="absolute" top={0} right={0} bottom={0} left={0}>
        {children}
      </Box>
    </Box>
  );
}
