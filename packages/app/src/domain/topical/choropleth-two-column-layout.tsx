import { Children, ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { assert } from '~/utils/assert';

interface TopicalChoroplethTileProps {
  children: ReactNode;
}

export function ChoroplethTwoColumnLayout(props: TopicalChoroplethTileProps) {
  const { children } = props;
  const childrenCount = Children.count(children);

  assert(
    childrenCount === 2,
    `ChoroplethTwoColumnLayout can only have 2 children, but received ${childrenCount}`
  );

  const childrenArray = Children.toArray(children);

  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', md: 'row' }}
      pt={{ _: 3, md: 4 }}
    >
      <Box
        flex={{ _: '1 1 0%', md: '0.8 1 0%', lg: '0.65 1 0%' }}
        px={{ _: 0, sm: 5, md: 3, lg: 5 }}
        pb={{ _: 4, md: 0 }}
      >
        {childrenArray[0]}
      </Box>
      <Box
        flex="1 1 0%"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        pl={{ _: 0, md: 5 }}
      >
        {childrenArray[1]}
      </Box>
    </Box>
  );
}
