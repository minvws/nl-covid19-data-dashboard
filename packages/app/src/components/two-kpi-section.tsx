import css from '@styled-system/css';
import React from 'react';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';

interface TwoKpiSectionProps {
  children: React.ReactNode;
  spacing?: number;
}

export function TwoKpiSection({ children, spacing }: TwoKpiSectionProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', lg: 'row' }}
      css={css({
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
