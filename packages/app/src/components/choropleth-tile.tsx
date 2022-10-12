import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { DataProps } from '~/types/attributes';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Box } from './base';
import {
  ChartRegionControls,
  RegionControlOption,
} from './chart-region-controls';
import { ErrorBoundary } from './error-boundary';
import { FullscreenChartTile } from './fullscreen-chart-tile';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';

type ChoroplethTileProps = DataProps & {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
    type?: 'default' | 'bar';
  };
  metadata?: MetadataProps;
  valueAnnotation?: string;
  hasPadding?: boolean;
} & (
    | {
        onChartRegionChange: (v: RegionControlOption) => void;
        chartRegion: 'gm' | 'vr';
      }
    | {
        onChartRegionChange?: undefined;
        chartRegion?: undefined;
      }
  );

export function ChoroplethTile({
  title,
  description,
  onChartRegionChange,
  chartRegion,
  legend,
  children,
  metadata,
  valueAnnotation,
  hasPadding,
  ...dataProps
}: ChoroplethTileProps) {
  const breakpoints = useBreakpoints(true);
  const legendaComponent = legend && (
    <Box maxWidth={300} width="100%">
      <ChoroplethLegenda
        thresholds={legend.thresholds}
        title={legend.title}
        valueAnnotation={valueAnnotation}
        type={legend.type}
      />
    </Box>
  );

  return (
    <FullscreenChartTile metadata={metadata}>
      <Box
        display="flex"
        flexDirection={{ _: 'column', lg: 'row' }}
        m={0}
        as="figure"
        {...dataProps}
        height="100%"
        spacing={3}
      >
        <Box flex={{ lg: 1 }} as="figcaption" spacing={3}>
          <Heading level={3}>{title}</Heading>

          {typeof description === 'string' ? (
            <Text>{description}</Text>
          ) : (
            description
          )}

          {onChartRegionChange && chartRegion && (
            <Box
              display="flex"
              justifyContent={{ _: 'center', lg: 'flex-start' }}
              pt={4}
            >
              <ChartRegionControls
                value={chartRegion}
                onChange={onChartRegionChange}
              />
            </Box>
          )}

          {legendaComponent && breakpoints.lg && (
            <Box display="flex" flexDirection="row" alignItems="flex-center">
              {legendaComponent}
            </Box>
          )}
        </Box>

        <Box
          flex={{ lg: 1 }}
          display="flex"
          flexDirection="column"
          height="100%"
          spacing={3}
        >
          <Box
            height="100%"
            mt={4}
            pl={hasPadding && breakpoints.lg ? 4 : undefined}
          >
            <ErrorBoundary>{children}</ErrorBoundary>
          </Box>

          {legendaComponent && !breakpoints.lg && (
            <Box display="flex" justifyContent="center">
              {legendaComponent}
            </Box>
          )}
        </Box>
      </Box>
    </FullscreenChartTile>
  );
}
