import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { MetadataProps } from '~/components/metadata';

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
    <ChartTile metadata={metadata} title={title} description={description}>
      {children}
      {legendaComponent && (
        <Box display="flex" justifyContent="flex-start">
          {legendaComponent}
        </Box>
      )}
    </ChartTile>
  );
}
