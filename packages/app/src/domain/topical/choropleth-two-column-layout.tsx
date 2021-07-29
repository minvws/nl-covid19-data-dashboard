import { Children, ReactNode } from 'react';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { assert } from '~/utils/assert';
import { useBreakpoints } from '~/utils/use-breakpoints';
interface TopicalChoroplethTileProps {
  children: ReactNode;
  legendComponent?: ReactNode;
}

export function ChoroplethTwoColumnLayout(props: TopicalChoroplethTileProps) {
  const { children, legendComponent } = props;
  const childrenCount = Children.count(children);

  const breakpoints = useBreakpoints(true);

  assert(
    childrenCount === 2,
    `ChoroplethTwoColumnLayout can only have 2 children, but received ${childrenCount}`
  );

  const childrenArray = Children.toArray(children);

  return (
    <Box display="flex" flexDirection={{ _: 'column', md: 'row' }}>
      {!breakpoints.md ? (
        <>
          <Box pb={4}>{childrenArray[1]}</Box>
          <Box flex={{ _: '1 1 0%' }} px={{ _: 0, sm: '6rem' }} pb={4}>
            {childrenArray[0]}
          </Box>
          <Box maxWidth={300}>{legendComponent}</Box>
        </>
      ) : (
        <>
          <Box flex={{ _: '1 1 0%', lg: '0.40 1 0%' }} px={{ _: 4, lg: 5 }}>
            <ErrorBoundary>{childrenArray[0]}</ErrorBoundary>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            flex={{ _: '0.95 1 0%', lg: '1 1 0%' }}
            pl={{ _: 4, lg: 5 }}
            maxWidth={500}
            spacing={4}
          >
            <ErrorBoundary>
              {childrenArray[1]}
              {legendComponent}
            </ErrorBoundary>
          </Box>
        </>
      )}
    </Box>
  );
}
