import css from '@styled-system/css';
import React, { useEffect, useState } from 'react';
import { TimeframeOption } from '~/utils/timeframe';
import { Box } from './base';
import { ChartTileContainer } from './chart-tile-container';
import { ChartTimeControls } from './chart-time-controls';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';
// import { assert } from '~/utils/assert';
// import slugify from 'slugify';
import { asResponsiveArray } from '~/style/utils';

interface ChartTileHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  hasAdditionalNavigation?: boolean;
}

function ChartTileHeader({
  title,
  description,
  children,
  hasAdditionalNavigation,
}: ChartTileHeaderProps) {
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
          mb={hasAdditionalNavigation ? asResponsiveArray({ _: 3, lg: 0 }) : 3}
          css={css({
            transform: hasAdditionalNavigation
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

interface ChartTileProps {
  title: string;
  metadata: MetadataProps;
  children: (
    timeframe: TimeframeOption | React.ReactElement
  ) => React.ReactNode;
  description?: string;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  hasAdditionalNavigation?: boolean;
  isSewerChart?: boolean;
}

export function ChartTile({
  title,
  description,
  children,
  metadata,
  timeframeOptions,
  timeframeInitialValue,
  hasAdditionalNavigation,
  isSewerChart,
}: ChartTileProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>();

  useEffect(() => {
    if (timeframeInitialValue) setTimeframe(timeframeInitialValue);
    if (timeframeOptions && !timeframeInitialValue)
      setTimeframe(timeframeOptions[0]);
  }, [timeframeOptions, timeframeInitialValue]);

  return (
    <ChartTileContainer metadata={metadata}>
      <ChartTileHeader
        title={title}
        description={description}
        hasAdditionalNavigation={hasAdditionalNavigation}
      >
        {timeframeOptions && timeframe && (
          <ChartTimeControls
            timeframeOptions={timeframeOptions}
            timeframe={timeframe}
            onChange={setTimeframe}
          />
        )}
      </ChartTileHeader>
      {/* Clone element and assign a timeframe to it if there are timeframeOptions */}
      {timeframeOptions && !isSewerChart
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
