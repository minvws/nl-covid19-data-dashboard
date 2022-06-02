import React from 'react';
import css from '@styled-system/css';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';

interface TwoKpiSectionProps {
  children: React.ReactNode;
  spacing?: number;
  hasBorder?: boolean;
  hasPadding?: boolean;
}

export function TwoKpiSection({
  children,
  spacing,
  hasBorder = false,
  hasPadding = false,
}: TwoKpiSectionProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', lg: 'row' }}
      css={css({
        borderTop: hasBorder ? 'solid 2px lightGray' : undefined,
        pt: hasPadding ? 4 : undefined,
        pb: hasPadding ? asResponsiveArray({ _: 3, sm: 4 }) : undefined,
        '& > *': {
          flex: 1,
        },
        '& > *:not(:last-child)': {
          mr: asResponsiveArray({ _: 0, lg: spacing ?? 5 }),
          mb: asResponsiveArray({ _: spacing ?? 4, lg: 0 }),
        },
      })}
    >
      {children}
    </Box>
  );
}
