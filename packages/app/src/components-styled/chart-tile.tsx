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

type ChartTileProps = {
  title: string;
  metadata: MetadataProps;
  description?: string;
  timeframeInitialValue?: TimeframeOption;
  hasAdditionalNavigation?: boolean;
  ariaLabelledBy?: string;
  ariaDescription?: string;
} & (
  | {
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
  timeframeInitialValue,
  hasAdditionalNavigation,
  ariaLabelledBy,
  ariaDescription,
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
      {timeframeOptions && typeof children === 'function'
        ? children(timeframe as TimeframeOption)
        : children}
    </ChartTileContainer>
  );
}
