import { assert } from '@corona-dashboard/common';
import { ReactNode, useState } from 'react';
import { TimeframeOption } from '~/utils/timeframe';
import { Box } from './base';
import { FullscreenChartTile } from './fullscreen-chart-tile';
import { ChartTimeControls } from './chart-time-controls';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';
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
    <Box>
      <Heading level={3}>{title}</Heading>
      <Box>
        {description && (
          <Box maxWidth={560}>
            <Text> {description}</Text>
          </Box>
        )}
        {children && (
          <Box display="inline-table" alignSelf="flex-start" mb={3}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
}

type ChartTileProps = {
  title: string;
  metadata: MetadataProps;
  description?: string;
  timeframeInitialValue?: TimeframeOption;
} & (
  | // Check if the children are a function to support the timeline callback, otherwise accept a normal react node
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
}: ChartTileProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>(
    timeframeInitialValue
  );

  return (
    <FullscreenChartTile metadata={metadata}>
      <ChartTileHeader title={title} description={description}>
        {timeframeOptions && timeframe && (
          <ChartTimeControls
            timeframeOptions={timeframeOptions}
            timeframe={timeframe}
            onChange={setTimeframe}
          />
        )}
      </ChartTileHeader>
      {timeframeOptions
        ? (assert(
            typeof children === 'function',
            'When using timeframeOptions, we expect a function-as-child component to handle the timeframe value.'
          ),
          children(timeframe))
        : children}
    </FullscreenChartTile>
  );
}
