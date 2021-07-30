import { assert, TimeframeOption } from '@corona-dashboard/common';
import { ReactNode, useState } from 'react';
import { Box, Spacer } from './base';
import { ChartTimeControls } from './chart-time-controls';
import { ErrorBoundary } from './error-boundary';
import { FullscreenChartTile } from './fullscreen-chart-tile';
import { Markdown } from './markdown';
import { MetadataProps } from './metadata';
import { Heading } from './typography';

type ChartTileProps = {
  title: string;
  metadata?: MetadataProps;
  description?: string;
  timeframeInitialValue?: TimeframeOption;
  disableFullscreen?: boolean;
} & (
  | // Check if the children are a function to support the timeframe callback, otherwise accept a normal react node
  {
      timeframeOptions?: undefined;
      children: ReactNode;
    }
  | {
      timeframeOptions: TimeframeOption[];
      children: (timeframe: TimeframeOption) => ReactNode;
    }
);

export function ChartTile({
  title,
  description,
  children,
  metadata,
  timeframeOptions,
  timeframeInitialValue = 'all',
  disableFullscreen,
}: ChartTileProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>(
    timeframeInitialValue
  );

  return (
    <FullscreenChartTile metadata={metadata} disabled={disableFullscreen}>
      <ChartTileHeader title={title} description={description}>
        {timeframeOptions && timeframe && (
          <ChartTimeControls
            timeframeOptions={timeframeOptions}
            timeframe={timeframe}
            onChange={setTimeframe}
          />
        )}
      </ChartTileHeader>

      <Spacer mb={description || (timeframeOptions && timeframe) ? 4 : 3} />

      <ErrorBoundary>
        {timeframeOptions
          ? (assert(
              typeof children === 'function',
              'When using timeframeOptions, we expect a function-as-child component to handle the timeframe value.'
            ),
            children(timeframe))
          : children}
      </ErrorBoundary>
    </FullscreenChartTile>
  );
}

interface ChartTileHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

function ChartTileHeader({
  title,
  description,
  children,
}: ChartTileHeaderProps) {
  return (
    <Box spacing={3}>
      <Heading level={3}>{title}</Heading>

      {description && (
        <Box maxWidth="maxWidthText">
          <Markdown content={description} />
        </Box>
      )}
      {children && (
        <Box display="inline-table" alignSelf="flex-start">
          {children}
        </Box>
      )}
    </Box>
  );
}
