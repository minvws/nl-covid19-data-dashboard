import React, { Children } from 'react';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';

interface TwoKpiSectionProps {
  children: React.ReactNode;
  spacing?: number;
}

export function TwoKpiSection({ children, spacing }: TwoKpiSectionProps) {
  const hasOnlyOneChild = Children.toArray(children).length === 1;

  return (
    <Box
      display="grid"
      gridTemplateColumns={asResponsiveArray({ _: '1fr', lg: '1fr 1fr' })}
      gridColumnGap={asResponsiveArray({ _: 0, lg: spacing ?? '10rem' })}
      gridRowGap={asResponsiveArray({ _: '3rem', lg: spacing ?? '8rem' })}
      borderTop={hasOnlyOneChild ? 'solid 2px lightGray' : undefined}
      pt={hasOnlyOneChild ? 4 : undefined}
      pb={hasOnlyOneChild ? asResponsiveArray({ _: 3, sm: 4 }) : undefined}
    >
      {children}
    </Box>
  );
}
