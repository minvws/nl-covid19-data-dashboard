import { Box, Spacer } from './base';
import { ChartTileToggle, ChartTileToggleProps } from './chart-tile-toggle';
import { ChartTimeControls } from './chart-time-controls';
import { ErrorBoundary } from './error-boundary';
import { FullscreenChartTile } from './fullscreen-chart-tile';
import { Heading } from './typography';
import { Markdown } from './markdown';
import { MetadataProps } from './metadata/types';
import { ReactNode, useEffect, useState } from 'react';
import { TimeframeOption } from '@corona-dashboard/common';
import styled from 'styled-components';
import theme, { space } from '~/style/theme';

interface ChartTileProps {
  children: ReactNode;
  description?: string;
  disableFullscreen?: boolean;
  id?: string;
  metadata?: MetadataProps;
  onSelectTimeframe?: (timeframe: TimeframeOption) => void;
  timeframeInitialValue?: TimeframeOption;
  timeframeOptions?: TimeframeOption[];
  title: string;
  toggle?: ChartTileToggleProps;
}

export const ChartTile = ({
  children,
  description,
  disableFullscreen,
  id,
  metadata,
  onSelectTimeframe,
  timeframeInitialValue,
  timeframeOptions,
  title,
  toggle,
}: ChartTileProps) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>(timeframeInitialValue || TimeframeOption.ALL);

  useEffect(() => {
    if (onSelectTimeframe) {
      onSelectTimeframe(timeframe);
    }
  }, [timeframe, onSelectTimeframe]);

  return (
    <FullscreenChartTile metadata={metadata} disabled={disableFullscreen} id={id}>
      <ChartTileHeader title={title} description={description} toggle={toggle}>
        {timeframeOptions && timeframe && (
          <Box width={{ sm: '100%', lg: '50%', xl: '25%' }}>
            <ChartTimeControls timeframeOptions={timeframeOptions} timeframe={timeframe} onChange={setTimeframe} />
          </Box>
        )}
      </ChartTileHeader>

      <Spacer marginBottom={description || timeframeOptions ? space[4] : space[3]} />

      <ErrorBoundary>{children}</ErrorBoundary>
    </FullscreenChartTile>
  );
};

interface ChartTileHeaderProps {
  title: string;
  children?: ReactNode;
  description?: string;
  toggle?: ChartTileToggleProps;
}

const ChartTileHeader = ({ title, description, children, toggle }: ChartTileHeaderProps) => {
  return (
    <Box spacing={3}>
      <ChartTileHeading level={3}>{title}</ChartTileHeading>

      {toggle && <ChartTileToggle initialValue={toggle.initialValue} items={toggle.items} onChange={toggle.onChange} />}

      {description && (
        <Box maxWidth="maxWidthText">
          <Markdown content={description} />
        </Box>
      )}

      {children && (
        <Box display="inline-table" alignSelf="flex-start" width="100%">
          {children}
        </Box>
      )}
    </Box>
  );
};

const ChartTileHeading = styled(Heading)`
  // padding-right to make sure the title doesn't touch/overlap the full screen button
  @media ${theme.mediaQueries.md} {
    padding-right: ${space[5]};
  }
`;
