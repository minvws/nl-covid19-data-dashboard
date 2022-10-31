import { colors } from '@corona-dashboard/common';
import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { Box } from '../base';
import { Legend, LegendItem } from '../legend';
import { TimelineTooltipContent } from '../time-series-chart/components/timeline/components/tooltip-content';
import { Heading } from '../typography';
import { TimelineBar } from './timeline-bar';
import { TimelineBarPart } from './timeline-bar-part';
import { TimelineEvent } from './timeline-event';

interface TimelineEventConfig {
  title: string;
  description: string;
  start: number;
  end: number;
  level?: number;
}

interface TimelineProps {
  startDate: number;
  endDate: number;
  timelineEvents?: TimelineEventConfig[];
  size?: number;
  labels: {
    [key: string]: string;
  };
  disableLegend?: boolean;
  disableTimelineArrow?: boolean;
  disableTimelineTimestamps?: boolean;
  legendItems?: LegendItem[];
  colorLookupMethod?: (level: any) => string;
}

export const Timeline = ({
  labels,
  startDate,
  endDate,
  timelineEvents,
  size = 10,
  disableTimelineArrow,
  disableLegend = false,
  disableTimelineTimestamps = false,
  legendItems,
  colorLookupMethod,
}: TimelineProps) => {
  const { formatDate } = useIntl();

  const [ref] = useResizeObserver<HTMLDivElement>();

  const [index, setIndex] = useState<number | undefined>();

  const indexRef = useRef(index);
  indexRef.current = index;

  const hideTooltip = useCallback(
    (index: number) => indexRef.current === index && setIndex(undefined),
    [setIndex]
  );

  const getTimelineComponentColor = (timelineEvent: TimelineEventConfig) =>
    colorLookupMethod && timelineEvent.level
      ? colorLookupMethod(timelineEvent.level)
      : colors.primary;

  return (
    <Box my={space[3]} position="relative">
      <TimelineHeading level={4}>{labels.heading}</TimelineHeading>

      <TimelineBar height={size}>
        {!disableTimelineArrow && <TimelineBarArrow />}

        {timelineEvents &&
          timelineEvents.map((timelineEvent, i) => (
            <TimelineBarPart
              key={i}
              color={getTimelineComponentColor(timelineEvent)}
              isFirst={i === 0}
              isLast={i + 1 === timelineEvents.length}
              size={size}
              width={`${100 / timelineEvents.length}%`}
            >
              <TimelineEvent
                size={size}
                isSelected={i === index}
                isHighlighted={i === index}
                onHide={() => hideTooltip(i)}
                onShow={() => setIndex(i)}
                timelineContainerRef={ref}
                color={getTimelineComponentColor(timelineEvent)}
                tooltipContent={
                  <TimelineTooltipContent
                    config={timelineEvent as TimelineEventConfig}
                    onNext={() => setIndex(i + 1)}
                    onPrev={() => setIndex(i - 1)}
                    onClose={() => hideTooltip(i)}
                    hasMultipleEvents={timelineEvents.length > 1}
                  />
                }
              />
            </TimelineBarPart>
          ))}
      </TimelineBar>

      {!disableTimelineTimestamps && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={space[3]}
        >
          <TimelineTimestamp dateTime={formatDate(startDate, 'iso')}>
            {formatDate(startDate, 'axis-with-year')}
          </TimelineTimestamp>

          <TimelineTimestamp dateTime={formatDate(endDate, 'iso')}>
            {formatDate(endDate, 'axis-with-year')}
          </TimelineTimestamp>
        </Box>
      )}

      {!disableLegend && legendItems && <Legend items={legendItems} />}
    </Box>
  );
};

const TimelineBarArrow = () => (
  <Box
    position="absolute"
    top={`-${space[4]}`}
    left="0"
    transform="translateX(-50%)"
  >
    <Box
      borderTop={`${space[2]} solid ${colors.black}`}
      borderLeft={`${space[2]} solid transparent`}
      borderRight={`${space[2]} solid transparent`}
      m={2}
    />
  </Box>
);

const TimelineHeading = styled(Heading)`
  margin-bottom: ${space[2]};
`;

const TimelineTimestamp = styled.time`
  color: ${colors.gray6};
  font-size: 12px;
`;
