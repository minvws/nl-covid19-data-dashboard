import React from 'react';
import { assert } from '~/utils/assert';
import { Box, BoxProps } from './base';

interface TwoKpiSectionProps extends BoxProps {
  children: React.ReactNode;
}

export function TwoKpiSection({ children, ...props }: TwoKpiSectionProps) {
  const childrenCount = React.Children.count(children);

  assert(
    childrenCount < 3,
    `TwoKpiSection can only have 1 or 2 children, but received ${childrenCount}`
  );

  const hasTwoChildren = childrenCount === 2;
  const childrenArray = React.Children.toArray(children);

  return (
    <Box display={{ lg: 'flex' }} {...(props as any)}>
      <Box flex={`1 1 ${hasTwoChildren ? 50 : 100}%`} mb={{ _: 4, lg: 0 }}>
        {childrenArray[0]}
      </Box>
      {hasTwoChildren && (
        <Box flex="1 1 50%" ml={{ lg: 3 }}>
          {childrenArray[1]}
        </Box>
      )}
    </Box>
  );
}
