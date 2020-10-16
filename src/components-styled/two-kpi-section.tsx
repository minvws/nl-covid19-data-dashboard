import React from 'react';
import { assert } from '~/utils/assert';
import { Box } from './base';

interface TwoKpiSectionProps {
  children: React.ReactNode;
}

export function TwoKpiSection({ children }: TwoKpiSectionProps) {
  const childrenCount = React.Children.count(children);

  assert(
    childrenCount < 3,
    `TwoKpiSection can only have 1 or 2 children, but received ${childrenCount}`
  );

  const childrenArray = React.Children.toArray(children);

  return (
    // The mb here could alternatively be set using a <Spacer/> in the page markup
    <Box display="flex" mb={4}>
      <Box flex="1 1 50%" mr={3}>
        {childrenArray[0]}
      </Box>
      <Box flex="1 1 50%">{childrenArray[1]}</Box>
    </Box>
  );
}
