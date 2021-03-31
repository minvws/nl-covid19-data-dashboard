import css from '@styled-system/css';
import React, { useState } from 'react';
import { TimeframeOption } from '~/utils/timeframe';
import { Box } from './base';
import { ChartTileContainer } from './chart-tile-container';
import { ChartTimeControls } from './chart-time-controls';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';
import { assert } from '~/utils/assert';
import slugify from 'slugify';
import { asResponsiveArray } from '~/style/utils';
interface ChartTileProps {
  children: React.ReactNode;
  metadata: MetadataProps;
  title: string;
  description?: React.ReactNode;
  ariaDescription?: string;
  ariaLabelledBy?: string;
}

interface ChartTileWithTimeframeProps extends Omit<ChartTileProps, 'children'> {
  children: (timeframe: TimeframeOption) => React.ReactNode;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  ariaDescription?: string;
  ariaLabelledBy?: string;
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
  const ariaLabelledBy = slugify(title);

  return (
    <ChartTileContainer metadata={metadata}>
      <ChartTileHeader
        title={title}
        description={description}
        ariaDescription={ariaDescription}
        ariaLabelledBy={ariaLabelledBy}
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
  ariaLabelledBy,
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
        ariaLabelledBy={ariaLabelledBy}
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
  ariaLabelledBy,
  ariaDescription,
}: {
  title: string;
  description?: React.ReactNode;
  timeframe?: TimeframeOption;
  timeframeOptions?: TimeframeOption[];
  onTimeframeChange?: (timeframe: TimeframeOption) => void;
  ariaLabelledBy?: string;
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

        {description ? (
          typeof description === 'string' ? (
            <p id={ariaLabelledBy} css={css({ m: 0 })}>
              {description}
            </p>
          ) : (
            <div id={ariaLabelledBy}>{description}</div>
          )
        ) : (
          <Box display="none" id={ariaLabelledBy}>
            {ariaDescription}
          </Box>
        )}
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

interface NewChartTileHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  hasExtraToggle?: boolean;
}

function NewChartTileHeader({
  title,
  description,
  children,
  hasExtraToggle,
}: NewChartTileHeaderProps) {
  return (
    <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }}>
      <Box maxWidth="maxWidthText" mr="auto" pr={{ _: 0, lg: 3 }}>
        <Heading level={3}>{title}</Heading>
        <Text> {description}</Text>
      </Box>
      {children && (
        <Box
          display="inline-table"
          alignSelf={{ _: 'flex-start', lg: 'flex-end' }}
          mb={hasExtraToggle ? asResponsiveArray({ _: 3, lg: 0 }) : 3}
          css={css({
            transform: hasExtraToggle
              ? asResponsiveArray({ lg: 'translateY(100%)' })
              : undefined,
            zIndex: 3,
          })}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

interface NewChartTileProps {
  title: string;
  metadata: MetadataProps;
  description?: string;
  children?: React.ReactNode;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  hasExtraToggle?: boolean;
}

export function NewChartTile({
  title,
  description,
  children,
  metadata,
  timeframeOptions,
  timeframeInitialValue = 'all',
  hasExtraToggle,
}: NewChartTileProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>(
    timeframeInitialValue
  );

  return (
    <ChartTileContainer metadata={metadata}>
      <NewChartTileHeader
        title={title}
        description={description}
        hasExtraToggle={hasExtraToggle}
      >
        {timeframeOptions && (
          <ChartTimeControls
            timeframeOptions={timeframeOptions}
            timeframe={timeframe}
            onChange={setTimeframe}
          />
        )}
      </NewChartTileHeader>
      {/* Clone element and assign a timeframe to it if there are timeframeOptions */}
      {timeframeOptions
        ? Array.isArray(children)
          ? children.map((item, index) =>
              React.cloneElement(item as React.ReactElement, {
                timeframe,
                key: index,
              })
            )
          : React.cloneElement(children as React.ReactElement, { timeframe })
        : children}
    </ChartTileContainer>
  );
}
