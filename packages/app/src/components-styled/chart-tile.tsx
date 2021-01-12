import css from '@styled-system/css';
import { useState } from 'react';
import { TimeframeOption } from '~/utils/timeframe';
import { Box } from './base';
import { ChartTileContainer } from './chart-tile-container';
import { ChartTimeControls } from './chart-time-controls';
import { MetadataProps } from './metadata';
import { Heading } from './typography';

interface ChartTileProps {
  children: React.ReactNode;
  metadata: MetadataProps;
  title: string;
  description?: React.ReactNode;
  ariaDescription?: string;
  uniqueAriaId?: string;
}

interface ChartTileWithTimeframeProps extends Omit<ChartTileProps, 'children'> {
  children: (timeframe: TimeframeOption) => React.ReactNode;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  ariaDescription?: string;
  uniqueAriaId?: string;
}

export function ChartTile({
  title,
  description,
  metadata,
  children,
  ariaDescription,
}: ChartTileProps) {
  if (!description && !ariaDescription)
    throw new Error(
      `This graph doesn't include a description, please add a ariaDescription property`
    );

  // const uniqueAriaId = title.replace(/\W+/g, '-').toLowerCase() as string;
  const uniqueAriaId = `_${Math.random().toString(36).substring(2, 15)}`;
  // const clonedReactElement = cloneElement(children as React.ReactElement<any>, {uniqueAriaId})

  return (
    <ChartTileContainer metadata={metadata}>
      <ChartTileHeader
        title={title}
        description={description}
        ariaDescription={ariaDescription}
        uniqueAriaId={uniqueAriaId}
      />
      {children}
    </ChartTileContainer>
  );
}

export function ChartTileWithTimeframe({
  title,
  description,
  metadata,
  timeframeOptions = ['all', '5weeks', 'week'],
  timeframeInitialValue = '5weeks',
  children,
  uniqueAriaId,
  ariaDescription,
}: ChartTileWithTimeframeProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>(
    timeframeInitialValue
  );

  // if (!description && !ariaDescription) throw new Error(`This graph doesn't include a description, please add a ariaDescription property`);

  return (
    <ChartTileContainer metadata={metadata}>
      <ChartTileHeader
        title={title}
        description={description}
        timeframe={timeframe}
        timeframeOptions={timeframeOptions}
        onTimeframeChange={setTimeframe}
        uniqueAriaId={uniqueAriaId}
        ariaDescription={ariaDescription}
      />
      {children(timeframe)}
    </ChartTileContainer>
  );
}

function ChartTileHeader({
  title,
  description,
  timeframe,
  timeframeOptions,
  onTimeframeChange,
  uniqueAriaId,
  ariaDescription,
}: {
  title: string;
  description?: React.ReactNode;
  timeframe?: TimeframeOption;
  timeframeOptions?: TimeframeOption[];
  onTimeframeChange?: (timeframe: TimeframeOption) => void;
  uniqueAriaId?: string;
  ariaDescription?: string;
}) {
  return (
    <Box
      mb={3}
      display="flex"
      flexDirection={{ _: 'column', lg: 'row' }}
      justifyContent="space-between"
    >
      <div css={css({ mb: [3, null, null, null, 0], mr: [0, 0, 2] })}>
        <Heading level={3}>{title}</Heading>
        {!description && (
          <div css={css({ display: 'none' })} aria-labelledby={uniqueAriaId}>
            {ariaDescription}
          </div>
        )}
        {description &&
          (typeof description === 'string' ? (
            <p aria-labelledby={uniqueAriaId} css={css({ m: 0 })}>
              {description}
            </p>
          ) : (
            <div aria-labelledby={uniqueAriaId}>{description}</div>
          ))}
      </div>
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
