import { colors, middleOfDayInSeconds } from '@corona-dashboard/common';
import { ReactNode, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { Box } from '~/components/base';
import { LegendItem, Legend } from '~/components/legend';
import { TimelineEvent } from '~/components/time-series-chart/components/timeline/components/timeline-event';
import { Heading } from '~/components/typography';
import { TimelineBar } from './components/timeline-bar';
import { TimelineBarPart } from './components/timeline-bar-part';
import { TimelineTooltipContent } from './components/tooltip-content';
import { getSeverityColor } from '../../logic/get-severity-color';
import { SeverityLevels } from '../../types';
import { useCurrentDate } from '~/utils/current-date-context';

export interface TimelineEventConfig {
  title: string;
  description: string;
  start: number;
  end: number;
  level: number;
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
}: TimelineProps) => {
  const { formatDate } = useIntl();
  const today = useCurrentDate();

  const [ref] = useResizeObserver<HTMLDivElement>();

  const [index, setIndex] = useState<number | undefined>();

  const indexRef = useRef(index);
  indexRef.current = index;

  const hideTooltip = useCallback(
    (index: number) => indexRef.current === index && setIndex(undefined),
    [setIndex]
  );

  if (!timelineEvents) return null;

  return (
    <Box my={space[3]} position="relative">
      <TimelineHeading level={4}>{labels.heading}</TimelineHeading>

      <TimelineBar height={size}>
        {timelineEvents.map((timelineEvent, i) => (
          <TimelineBarPart
            key={i}
            color={getSeverityColor(
              timelineEvent.level?.toString() as SeverityLevels
            )}
            isFirst={i === 0}
            isLast={i + 1 === timelineEvents.length}
            size={size}
            width={`${100 / timelineEvents.length}%`}
          >
            {!disableTimelineArrow && i + 1 === timelineEvents.length && (
              <TimelineBarArrow
                today={today}
                startDate={timelineEvents[timelineEvents.length - 1].start}
                endDate={timelineEvents[timelineEvents.length - 1].end}
              >
                {labels.today}
              </TimelineBarArrow>
            )}

            <TimelineEvent
              size={size}
              isSelected={i === index}
              isHighlighted={i === index}
              onHide={() => hideTooltip(i)}
              onShow={() => setIndex(i)}
              timelineContainerRef={ref}
              color={getSeverityColor(
                timelineEvent.level?.toString() as SeverityLevels
              )}
              tooltipContent={
                <TimelineTooltipContent
                  config={timelineEvent}
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

const getTimelineBarArrowOffset = (
  today: Date,
  startDate: number,
  endDate: number
) => {
  const todayInSeconds = middleOfDayInSeconds(today.getTime() / 1000);
  return todayInSeconds / (endDate - startDate) / 100;
};

const TimelineBarArrow = ({
  children,
  today,
  startDate,
  endDate,
}: {
  children: ReactNode;
  today: Date;
  startDate: number;
  endDate: number;
}) => (
  <>
    <Box
      position="absolute"
      top="-40px"
      left={`${getTimelineBarArrowOffset(today, startDate, endDate) ?? 0}%`}
      transform="translateX(-50%)"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {children}
      <Box
        borderTop={`${space[2]} solid ${colors.black}`}
        borderLeft={`${space[2]} solid transparent`}
        borderRight={`${space[2]} solid transparent`}
        width={space[2]}
        height={space[2]}
      />
    </Box>
  </>
);

const TimelineHeading = styled(Heading)`
  margin-bottom: ${space[3]};
`;

const TimelineTimestamp = styled.time`
  color: ${colors.gray6};
  font-size: 12px;
`;
