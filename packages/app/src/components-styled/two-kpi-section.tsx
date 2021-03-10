import React from 'react';
import { assert } from '~/utils/assert';
import { Box } from './base';

interface TwoKpiSectionProps {
  children: React.ReactNode;
  spacing?: number;
}

export function TwoKpiSection({ children, spacing = 3 }: TwoKpiSectionProps) {
  const childrenCount = React.Children.count(children);

  assert(
    childrenCount < 3,
    `TwoKpiSection can only have 1 or 2 children, but received ${childrenCount}`
  );

  const hasTwoChildren = childrenCount === 2;
  const childrenArray = React.Children.toArray(children);

  return (
    <Box display={{ lg: 'flex' }}>
      <Box flex={`1 1 ${hasTwoChildren ? 50 : 100}%`} mb={{ _: 4, lg: 0 }}>
        {childrenArray[0]}
      </Box>
      {hasTwoChildren && (
        <Box flex="1 1 50%" ml={{ lg: spacing }}>
          {childrenArray[1]}
        </Box>
      )}
    </Box>
  );
}
