import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { space } from '~/style/theme';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Box } from './base';
import { ChartRegionControls, RegionControlOption } from './chart-region-controls';
import { ErrorBoundary } from './error-boundary';
import { FullscreenChartTile } from './fullscreen-chart-tile';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';
import { CalendarGear } from '@corona-dashboard/icons';
type ChoroplethTileProps = {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
    outdatedDataLabel?: string;
  };
  metadata?: MetadataProps;
  valueAnnotation?: string;
  hasPadding?: boolean;
  pageType?: string;
  notification?: string;
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
  pageType,
  notification,
  ...dataProps
}: ChoroplethTileProps) {
  const breakpoints = useBreakpoints(true);
  const legendaComponent = legend && (
    <Box maxWidth="300px" width="100%">
      <ChoroplethLegenda thresholds={legend.thresholds} title={legend.title} valueAnnotation={valueAnnotation} pageType={pageType} outdatedDataLabel={legend.outdatedDataLabel} />
    </Box>
  );

  return (
    <FullscreenChartTile metadata={metadata}>
      <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }} margin="0" as="figure" {...dataProps} height="100%" spacing={3}>
        <Box flex={{ lg: '1' }} as="figcaption" spacing={3}>
          <Heading level={3}>{title}</Heading>

          {typeof description === 'string' ? <Text>{description}</Text> : description}

          {notification && (
            <Box display="flex" alignItems={'center'}>
              <CalendarGear />
              <Box marginLeft={space[2]}>
                <Text>{notification}</Text>
              </Box>
            </Box>
          )}

          {onChartRegionChange && chartRegion && (
            <Box display="flex" justifyContent="flex-start" paddingTop={space[4]}>
              <ChartRegionControls value={chartRegion} onChange={onChartRegionChange} />
            </Box>
          )}

          {legendaComponent && breakpoints.lg && (
            <Box display="flex" flexDirection="row" alignItems="flex-start">
              {legendaComponent}
            </Box>
          )}
        </Box>

        <Box flex={{ lg: '1' }} display="flex" flexDirection="column" height="100%" spacing={3}>
          <Box height="100%" marginTop={space[4]} paddingLeft={hasPadding && breakpoints.lg ? space[4] : undefined}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Box>

          {legendaComponent && !breakpoints.lg && (
            <Box display="flex" justifyContent="flex-start">
              {legendaComponent}
            </Box>
          )}
        </Box>
      </Box>
    </FullscreenChartTile>
  );
}
