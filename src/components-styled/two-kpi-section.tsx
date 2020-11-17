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
    <Box
      display={{ lg: 'flex' }}
      /**
       * The mb here could alternatively be applied using a <Spacer/> in the
       * page markup. It's a choice, whether we like to include the bottom
       * margin on all our commonly used components or keep everything flexible
       * and use spacers in the context where the component is used.
       */
      mb={4}
      /**
       * The ml and mr negative margins should not be part of this component
       * ideally, but are the results of the page layout having paddings even on
       * small screens. We can remove this once we make all page section
       * elements full-width and remove the padding from the page layout.
       */
      ml={{ _: -4, sm: 0 }}
      mr={{ _: -4, sm: 0 }}
      {...(props as any)}
    >
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
