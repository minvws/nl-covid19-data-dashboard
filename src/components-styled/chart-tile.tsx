import css from '@styled-system/css';
import { useState } from 'react';
import { TimeframeOption } from '~/utils/timeframe';
import { Box, Spacer } from './base';
import { ChartTimeControls } from './chart-time-controls';
import { Tile } from './layout';
import { Metadata, MetadataProps } from './metadata';

interface ChartTileProps {
  title: string;
  metadata: MetadataProps;
  children: React.ReactNode;
}

interface ChartTileWithTimeframeProps {
  title: string;
  metadata: MetadataProps;
  children: (timeframe: TimeframeOption) => React.ReactNode;
  timeframeOptions: TimeframeOption[];
  timeframeInitialValue: TimeframeOption;
}

export function ChartTile({ title, metadata, children }: ChartTileProps) {
  return (
    <ChartTileContainer>
      <ChartTileHeader title={title} />

      {children}

      <Spacer m="auto" />
      <Metadata {...metadata} />
    </ChartTileContainer>
  );
}

export function ChartTileWithTimeframe({
  title,
  metadata,
  timeframeOptions,
  timeframeInitialValue,
  children,
}: ChartTileWithTimeframeProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>(
    timeframeInitialValue
  );

  return (
    <ChartTileContainer>
      <ChartTileHeader
        title={title}
        timeframe={timeframe}
        timeframeOptions={timeframeOptions}
        onTimeframeChange={setTimeframe}
      />

      {children(timeframe)}

      <Spacer m="auto" />
      <Metadata {...metadata} />
    </ChartTileContainer>
  );
}

function ChartTileContainer({ children }: { children: React.ReactNode }) {
  return (
    <Tile mb={4} ml={{ _: -4, sm: 0 }} mr={{ _: -4, sm: 0 }}>
      {children}
    </Tile>
  );
}

function ChartTileHeader({
  title,
  timeframe,
  timeframeOptions,
  onTimeframeChange,
}: {
  title: string;
  timeframe?: TimeframeOption;
  timeframeOptions?: TimeframeOption[];
  onTimeframeChange?: (timeframe: TimeframeOption) => void;
}) {
  return (
    <Box
      mb={3}
      display="flex"
      flexDirection={['column', null, null, null, 'row']}
    >
      <h3 css={css({ mb: [3, null, null, null, 0], mr: [0, 0, 2] })}>
        {title}
      </h3>
      {timeframe && onTimeframeChange && (
        <div css={css({ ml: [0, 0, 2] })}>
          <ChartTimeControls
            timeframeOptions={timeframeOptions}
            timeframe={timeframe}
            onChange={onTimeframeChange}
          />
        </div>
      )}
    </Box>
  );
}
