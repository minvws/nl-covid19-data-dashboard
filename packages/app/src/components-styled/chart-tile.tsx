import React, { useEffect, useState } from 'react';
import { TimeframeOption } from '~/utils/timeframe';
import { Box } from './base';
import { ChartTileContainer } from './chart-tile-container';
import { ChartTimeControls } from './chart-time-controls';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';
interface ChartTileHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
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
      children: React.ReactNode;
    }
  | {
      timeframeOptions: TimeframeOption[];
      children: (timeframe: TimeframeOption) => React.ReactNode;
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
  const [timeframe, setTimeframe] = useState<TimeframeOption>();

  useEffect(() => {
    if (timeframeOptions && !timeframeOptions.includes(timeframeInitialValue)) {
      setTimeframe(timeframeOptions[0]);
      return;
    }
    setTimeframe(timeframeInitialValue);
  }, [timeframeOptions, timeframeInitialValue]);

  return (
    <ChartTileContainer metadata={metadata}>
      <ChartTileHeader title={title} description={description}>
        {timeframeOptions && timeframe && (
          <ChartTimeControls
            timeframeOptions={timeframeOptions}
            timeframe={timeframe}
            onChange={setTimeframe}
          />
        )}
      </ChartTileHeader>
      {(timeframeOptions || timeframeInitialValue) &&
      typeof children === 'function'
        ? children(timeframe as TimeframeOption)
        : children}
    </ChartTileContainer>
  );
}
