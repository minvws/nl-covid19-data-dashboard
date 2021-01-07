import { ChoroplethLegenda } from '~/components-styled/choropleth-legenda';
import { ChoroplethThresholdsValue } from '~/components/choropleth/shared';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Box } from './base';
import {
  ChartRegionControls,
  RegionControlOption,
} from './chart-region-controls';
import { ChartTileContainer } from './chart-tile-container';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';

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
  onChartRegionChange?: (v: RegionControlOption) => void;
  chartRegion?: 'municipal' | 'region';
  children: React.ReactNode;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
  };
  metadata?: MetadataProps;
}

export function ChoroplethTile({
  title,
  description,
  onChartRegionChange,
  chartRegion,
  legend,
  children,
  metadata,
}: ChoroplethTileProps) {
  const breakpoints = useBreakpoints();
  const legendaComponent = legend && (
    <ChoroplethLegenda thresholds={legend.thresholds} title={legend.title} />
  );

  return (
    <ChartTileContainer metadata={metadata}>
      <Box
        display="flex"
        flexDirection={{ _: 'column', lg: 'row' }}
        m={0}
        as="figure"
      >
        <Box mb={3} flex={{ lg: 1 }} as="figcaption">
          <Box mb={[0, 2]}>
            <Heading level={3}>{title}</Heading>
            {typeof description === 'string' ? (
              <Text>{description}</Text>
            ) : (
              description
            )}
            {onChartRegionChange && (
              <Box
                display="flex"
                justifyContent={{ _: 'center', lg: 'flex-start' }}
              >
                <ChartRegionControls
                  value={chartRegion}
                  onChange={onChartRegionChange}
                />
              </Box>
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
    </ChartTileContainer>
  );
}
