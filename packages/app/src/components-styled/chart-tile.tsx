import css from '@styled-system/css';
import { useState } from 'react';
import { TimeframeOption } from '~/utils/timeframe';
import { Box } from './base';
import { ChartTileContainer } from './chart-tile-container';
import { ChartTimeControls } from './chart-time-controls';
import { MetadataProps } from './metadata';
import { Heading } from './typography';
import { assert } from '~/utils/assert';
import slugify from 'slugify';
interface ChartTileProps {
  children: React.ReactNode;
  metadata: MetadataProps;
  title: string;
  description?: React.ReactNode;
  ariaDescription?: string;
  ariaId?: string;
}

interface ChartTileWithTimeframeProps extends Omit<ChartTileProps, 'children'> {
  children: (timeframe: TimeframeOption) => React.ReactNode;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  ariaDescription?: string;
  ariaId?: string;
}

export function ChartTile({
  title,
  description,
  metadata,
  children,
  ariaDescription,
}: ChartTileProps) {
  assert(
    !(!description && !ariaDescription),
    `This graph doesn't include a valid description nor an ariaDescription, please add one of them.`
  );

  /**
   * Chart title should be unique on a page. If we instead use useUniqueId here
   * the SSR markup doesn't match the client-side rendered id, which generates a
   * warning and is probably problematic for screen readers.
   */
  const ariaId = slugify(title);

  return (
    <ChartTileContainer metadata={metadata}>
      <ChartTileHeader
        title={title}
        description={description}
        ariaDescription={ariaDescription}
        ariaId={ariaId}
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
  timeframeInitialValue = 'all',
  children,
  ariaId,
  ariaDescription,
}: ChartTileWithTimeframeProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>(
    timeframeInitialValue
  );

  return (
    <ChartTileContainer metadata={metadata}>
      <ChartTileHeader
        title={title}
        description={description}
        timeframe={timeframe}
        timeframeOptions={timeframeOptions}
        onTimeframeChange={setTimeframe}
        ariaId={ariaId}
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
  ariaId,
  ariaDescription,
}: {
  title: string;
  description?: React.ReactNode;
  timeframe?: TimeframeOption;
  timeframeOptions?: TimeframeOption[];
  onTimeframeChange?: (timeframe: TimeframeOption) => void;
  ariaId?: string;
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
          <div css={css({ display: 'none' })} aria-labelledby={ariaId}>
            {ariaDescription}
          </div>
        )}
        {description &&
          (typeof description === 'string' ? (
            <p aria-labelledby={ariaId} css={css({ m: 0 })}>
              {description}
            </p>
          ) : (
            <div aria-labelledby={ariaId}>{description}</div>
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
