import { Box } from '~/components-styled/base';
import { ChoroplethLegenda } from '~/components-styled/choropleth-legenda';
import { Heading, Text } from '~/components-styled/typography';
import { ChoroplethThresholdsValue } from '~/components/choropleth/shared';
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

interface ChoroplethTileProps extends DataProps {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
  };
}

export function TopicalChoroplethTile({
  title,
  description,
  legend,
  children,
}: ChoroplethTileProps) {
  const breakpoints = useBreakpoints();
  const legendaComponent = legend && (
    <ChoroplethLegenda thresholds={legend.thresholds} title={legend.title} />
  );

  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', lg: 'row' }}
      m={0}
      as="figure"
    >
      <Box mb={3} flex={{ lg: 1 }} as="figcaption">
        <Box mb={[0, 2]}>
          <Heading level={2} fontSize="3.5em" lineHeight="1em">
            {title}
          </Heading>
          {typeof description === 'string' ? (
            <Text>{description}</Text>
          ) : (
            description
          )}
        </Box>

        {legendaComponent && breakpoints.lg && (
          <Box display="flex" flexDirection="row" alignItems="flex-center">
            {legendaComponent}
          </Box>
        )}
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
