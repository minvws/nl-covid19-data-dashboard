import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { ChoroplethLegenda } from '~/components-styled/choropleth-legenda';
import { Heading, Text } from '~/components-styled/typography';
import { useBreakpoints } from '~/utils/useBreakpoints';

/**
 * We could use strong typing here for the values and also enforce the data
 * prop to be set. Might be a good idea.
 *
 * @TODO move to a shared location
 */
interface DataProps {
  'data-cy'?: string;
}

interface TopicalChoroplethContainerProps extends DataProps {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
  };
  legendComponent?: ReactNode;
}

export function TopicalChoroplethContainer({
  title,
  description,
  legend,
  legendComponent,
  children,
}: TopicalChoroplethContainerProps) {
  const breakpoints = useBreakpoints();
  const legendaComponent =
    (legend && (
      <ChoroplethLegenda thresholds={legend.thresholds} title={legend.title} />
    )) ??
    legendComponent;

  return (
    <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }} m={0}>
      <Box mb={3} flex={{ lg: 1 }}>
        <Box mb={[0, 2]}>
          <Heading
            level={2}
            fontSize={{ _: '2.5em', lg: '3.5em' }}
            lineHeight="1em"
          >
            {title}
          </Heading>
          {typeof description === 'string' ? (
            <Text>{description}</Text>
          ) : (
            description
          )}
        </Box>

        {legendaComponent && breakpoints.lg && <div>{legendaComponent}</div>}
      </Box>

      <Box flex={{ lg: 1 }} ml={[0, 0, 3]}>
        <div>{children}</div>

        {legendaComponent && !breakpoints.lg && (
          <Box display="flex" justifyContent="center">
            {legendaComponent}
          </Box>
        )}
      </Box>
    </Box>
  );
}
