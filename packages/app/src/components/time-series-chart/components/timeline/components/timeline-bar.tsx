import { colors } from '@corona-dashboard/common';
import { transparentize } from 'polished';
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { space } from '~/style/theme';

interface TimelineBarProps {
  width: number;
  height: number;
  children?: ReactNode;
}

export function TimelineBar({ children, width, height }: TimelineBarProps) {
  return (
    <Box position="relative" bg={transparentize(0.8, colors.primary)} style={{ width, height }} display="flex" alignItems="center">
      <Box style={{ width }} borderTop="1px solid" borderTopColor={colors.primary} />
      <Box position="absolute" top={space[0]} right={space[0]} bottom={space[0]} left={space[0]}>
        {children}
      </Box>
    </Box>
  );
}

export function DottedTimelineBar({ children, width, height }: TimelineBarProps) {
  return (
    <Box position="relative" style={{ width, height }} display="flex" alignItems="center">
      <Box style={{ width }} borderTop="1px dotted" borderTopColor={colors.primary} />
      <Box position="absolute" top={space[0]} right={space[0]} bottom={space[0]} left={space[0]}>
        {children}
      </Box>
    </Box>
  );
}
