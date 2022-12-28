import { TimeframeOption } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode, useEffect, useState } from 'react';
import { asResponsiveArray } from '~/style/utils';
import { Box, Spacer } from './base';
import { ChartTimeControls } from './chart-time-controls';
import { ErrorBoundary } from './error-boundary';
import { FullscreenChartTile } from './fullscreen-chart-tile';
import { Heading } from './typography';
import { Markdown } from './markdown';
import { MetadataProps } from './metadata';
import { ChartTileToggle, ChartTileToggleProps } from './chart-tile-toggle';

interface ChartTileProps {
  title: string;
  metadata?: MetadataProps;
  description?: string;
  timeframeInitialValue?: TimeframeOption;
  disableFullscreen?: boolean;
  timeframeOptions?: TimeframeOption[];
  onSelectTimeframe?: (timeframe: TimeframeOption) => void;
  toggle?: ChartTileToggleProps;
  children: ReactNode;
}

export function ChartTile({ title, metadata, description, timeframeInitialValue, disableFullscreen, timeframeOptions, onSelectTimeframe, children, toggle }: ChartTileProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>(timeframeInitialValue || TimeframeOption.ALL);

  useEffect(() => {
    if (onSelectTimeframe) {
      onSelectTimeframe(timeframe);
    }
  }, [timeframe, onSelectTimeframe]);

  return (
    <FullscreenChartTile metadata={metadata} disabled={disableFullscreen}>
      <ChartTileHeader title={title} description={description} toggle={toggle}>
        {timeframeOptions && timeframe && (
          <Box
            css={css({
              width: asResponsiveArray({
                xl: '25%',
                lg: '50%',
                sm: '100%',
              }),
            })}
          >
            <ChartTimeControls timeframeOptions={timeframeOptions} timeframe={timeframe} onChange={setTimeframe} />
          </Box>
        )}
      </ChartTileHeader>

      <Spacer mb={description || timeframeOptions ? 4 : 3} />

      <ErrorBoundary>{children}</ErrorBoundary>
    </FullscreenChartTile>
  );
}

interface ChartTileHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  toggle?: ChartTileToggleProps;
}

function ChartTileHeader({ title, description, children, toggle }: ChartTileHeaderProps) {
  return (
    <Box spacing={3}>
      {/* padding-right to make sure the title doesn't touch/overlap the full screen button */}
      <Heading level={3} css={css({ pr: asResponsiveArray({ md: 5 }) })}>
        {title}
      </Heading>

      {toggle && <ChartTileToggle initialValue={toggle.initialValue} onChange={toggle.onChange} items={toggle.items} />}

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
}
