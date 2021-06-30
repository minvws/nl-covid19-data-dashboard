import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { ErrorBoundary } from '~/components/error-boundary';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { MetadataProps } from '~/components/metadata';
import { Heading, Text } from '~/components/typography';

type EuropeChoroplethTileProps = {
  children: ReactNode;
  title: string;
  description: string;
  metadata?: MetadataProps;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
  };
};

export function EuropeChoroplethTile(props: EuropeChoroplethTileProps) {
  const { children, title, description, metadata, legend } = props;

  const legendaComponent = legend && (
    <Box width="50%" pt={3}>
      <ChoroplethLegenda thresholds={legend.thresholds} title={legend.title} />
    </Box>
  );

  return (
    <FullscreenChartTile metadata={metadata}>
      <Box mb={3} flex={{ lg: 1 }} as="figcaption">
        <Heading level={3}>{title}</Heading>
        <Text>{description}</Text>
      </Box>
      <Box height="100%">
        <ErrorBoundary>{children}</ErrorBoundary>
      </Box>
      {legendaComponent && (
        <Box display="flex" justifyContent="flex-start">
          {legendaComponent}
        </Box>
      )}
    </FullscreenChartTile>
  );
}
