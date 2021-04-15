import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { DataProps } from '~/types/attributes';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Box } from './base';
import {
  ChartRegionControls,
  RegionControlOption,
} from './chart-region-controls';
import { ChartTileContainer } from './chart-tile-container';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';
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
  valueAnnotation?: string;
}

export function ChoroplethTile({
  title,
  description,
  onChartRegionChange,
  chartRegion,
  legend,
  children,
  metadata,
  valueAnnotation,
  ...dataProps
}: ChoroplethTileProps) {
  const breakpoints = useBreakpoints(true);
  const legendaComponent = legend && (
    <ChoroplethLegenda
      thresholds={legend.thresholds}
      title={legend.title}
      valueAnnotation={valueAnnotation}
    />
  );

  return (
    <ChartTileContainer metadata={metadata}>
      <Box
        display="flex"
        flexDirection={{ _: 'column', lg: 'row' }}
        m={0}
        as="figure"
        {...dataProps}
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
