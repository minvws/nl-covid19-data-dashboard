import css from '@styled-system/css';
import React, { useEffect, useState } from 'react';
import { TimeframeOption } from '~/utils/timeframe';
import { Box } from './base';
import { ChartTileContainer } from './chart-tile-container';
import { ChartTimeControls } from './chart-time-controls';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';
import styled from 'styled-components';
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
    <div
      css={css({
        '@media (min-width: 1330px)': {
          display: description ? undefined : 'flex',
        },
      })}
    >
      <Heading
        level={3}
        css={css({ flex: 1 })}
        pr={{ _: 0, md: description ? undefined : 3 }}
      >
        {title}
      </Heading>
      <StyledBox>
        {description && (
          <Box pr={{ _: 0, md: 3 }} maxWidth={560}>
            <Text> {description}</Text>
          </Box>
        )}
        {children && (
          <Box
            display="inline-table"
            alignSelf="flex-start"
            css={css({
              zIndex: 3,
              mb: 3,
              '@media (min-width: 1330px)': {
                alignSelf: 'flex-end',
                mb: hasAdditionalNavigation ? 0 : 3,
                transform: hasAdditionalNavigation
                  ? 'translateY(100%)'
                  : undefined,
              },
            })}
          >
            {children}
          </Box>
        )}
      </StyledBox>
    </div>
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
  hasAdditionalNavigation,
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
      {(timeframeOptions || timeframeInitialValue) &&
      typeof children === 'function'
        ? children(timeframe as TimeframeOption)
        : children}
    </ChartTileContainer>
  );
}

const StyledBox = styled(Box)(
  css({
    display: 'flex',
    flexDirection: 'column',

    '@media (min-width: 1330px)': {
      flexDirection: 'row',
    },
  })
);
