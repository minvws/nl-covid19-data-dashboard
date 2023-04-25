import { colors, middleOfDayInSeconds } from '@corona-dashboard/common';
import { ReactNode, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Legend, LegendItem } from '~/components/legend';
import { TimelineEvent } from '~/components/time-series-chart/components/timeline/components/timeline-event';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { useCurrentDate } from '~/utils/current-date-context';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { getSeverityColor } from '../../logic/get-severity-color';
import { SeverityLevels } from '../../types';
import { TimelineBar } from './components/timeline-bar';
import { TimelineBarPart } from './components/timeline-bar-part';
import { TimelineTooltipContent } from './components/tooltip-content';
import { getDifferenceInDays, getTimelineBarArrowOffset, getTimelineBarPartWidth } from './logic';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';

export interface SeverityIndicatorTimelineEventConfig {
  title: string;
  description: string;
  start: number;
  end: number;
  level: number;
}

interface TimelineProps {
  labels: {
    [key: string]: string;
  };
  startDate: number;
  endDate: number;
  timelineEvents: SeverityIndicatorTimelineEventConfig[];
  legendItems?: LegendItem[];
  size?: number;
}

export const Timeline = ({ labels, startDate, endDate, legendItems, size = 10, timelineEvents }: TimelineProps) => {
  const { formatDate } = useIntl();

  const [ref] = useResizeObserver<HTMLDivElement>();

  const [index, setIndex] = useState<number | undefined>();

  const indexRef = useRef(index);
  indexRef.current = index;

  const hideTooltip = useCallback((index: number) => indexRef.current === index && setIndex(undefined), [setIndex]);

  if (!timelineEvents) return null;

  const totalDays = (endDate - startDate) / (1000 * 3600 * 24);

  const timelineBarPartDays = (timelineEvent: SeverityIndicatorTimelineEventConfig) =>
    getDifferenceInDays(createDateFromUnixTimestamp(timelineEvent.start), createDateFromUnixTimestamp(timelineEvent.end));

  return (
    <Box marginY={space[3]} position="relative">
      <TimelineHeading level={4}>{labels.heading}</TimelineHeading>

      <TimelineBar height={size}>
        {timelineEvents.map((timelineEvent, i) => (
          <TimelineBarPart
            key={i}
            color={getSeverityColor(timelineEvent.level as SeverityLevels)}
            isFirst={i === 0}
            isLast={i + 1 === timelineEvents.length}
            size={size}
            width={`${getTimelineBarPartWidth(timelineBarPartDays(timelineEvent), totalDays)}%`}
          >
            {i + 1 === timelineEvents.length && (
              <TimelineBarArrow startDate={timelineEvents[timelineEvents.length - 1].start} endDate={timelineEvents[timelineEvents.length - 1].end}>
                {labels.today}
              </TimelineBarArrow>
            )}

            <TimelineEvent
              color={getSeverityColor(timelineEvent.level as SeverityLevels)}
              isHighlighted={i === index}
              isSelected={i === index}
              onHide={() => hideTooltip(i)}
              onShow={() => setIndex(i)}
              size={size}
              timelineContainerRef={ref}
              tooltipContent={
                <TimelineTooltipContent
                  config={timelineEvent}
                  hasMultipleEvents={timelineEvents.length > 1}
                  onNext={() => setIndex(i + 1)}
                  onPrev={() => setIndex(i - 1)}
                  onClose={() => hideTooltip(i)}
                  currentEstimationLabel={i + 1 === timelineEvents.length ? labels.tooltipCurrentEstimation : undefined}
                />
              }
            />
          </TimelineBarPart>
        ))}
      </TimelineBar>

      <Box display="flex" alignItems="center" justifyContent="space-between" marginY={space[3]}>
        <TimelineTimestamp dateTime={formatDate(startDate, 'iso')}>{formatDate(startDate, 'axis-with-year')}</TimelineTimestamp>

        <TimelineTimestamp dateTime={formatDate(endDate, 'iso')}>{formatDate(endDate, 'axis-with-year')}</TimelineTimestamp>
      </Box>

      {legendItems && <Legend items={legendItems} />}
    </Box>
  );
};

interface TimelineBarArrowProps {
  children: ReactNode;
  startDate: number;
  endDate: number;
}

const TimelineBarArrow = ({ children, startDate, endDate }: TimelineBarArrowProps) => {
  const todayDate = useCurrentDate();
  const middleOfTodaysDateInSeconds = middleOfDayInSeconds(todayDate.getTime() / 1000);

  if (middleOfTodaysDateInSeconds > middleOfDayInSeconds(endDate)) return null;

  const arrowLeftOffset = getTimelineBarArrowOffset(todayDate, startDate, endDate);

  return (
    <Box alignItems="center" display="flex" flexDirection="column" left={`${arrowLeftOffset}%`} position="absolute" top="-40px" transform="translateX(-50%)">
      {children}
      <Box
        borderLeft={`${space[2]} solid transparent`}
        borderRight={`${space[2]} solid transparent`}
        borderTop={`${space[2]} solid ${colors.black}`}
        height={space[2]}
        width={space[2]}
      />
    </Box>
  );
};

const TimelineHeading = styled(Heading)`
  margin-bottom: ${space[3]};
`;

const TimelineTimestamp = styled.time`
  color: ${colors.gray6};
  font-size: 12px;
`;
