import { colors } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Box } from '../base';

interface TimelineBarProps {
  height: number;
  children?: ReactNode;
}

export const TimelineBar = ({ children, height }: TimelineBarProps) => {
  return (
    <Box
      position="relative"
      // bg={transparentize(0.8, colors.primary)}
      style={{ height }}
      display="flex"
      alignItems="center"
    >
      <Box borderTop="1px solid" borderTopColor={colors.primary} />
      <Box position="absolute" top={0} right={0} bottom={0} left={0} display="flex" justifyContent="space-between">
        {children}
      </Box>
    </Box>
  );
};
