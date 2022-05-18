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
      display="grid"
      grid-template-columns={{ _: '1fr', lg: '1fr 1fr' }}
      column-gap={asResponsiveArray({ _: 0, lg: spacing ?? 10 })}
    >
      {children}
    </Box>
  );
}
