import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { Box } from '../base';
import { SeverityLevels } from '../severity-indicator-tile/types';
import { TimelineBar } from './timeline-bar';
import { TimelineBarPart } from './timeline-bar-part';

interface TimelineProps {
  startDate: number;
  endDate: number;
  timelineEvents?: ThermometerEventConfig[];
  size?: number;
}

interface ThermometerEventConfig {
  title: string;
  description: string;
  start: number;
  end: number;
  level: number;
}

export const Timeline = ({
  startDate,
  endDate,
  timelineEvents,
  size = 10,
}: TimelineProps) => {
  const { formatDate } = useIntl();

  const height = size;

  return (
    <Box my={space[3]}>
      <TimelineBar height={height}>
        {timelineEvents &&
          timelineEvents.map((timelineEvent, index) => (
            <TimelineBarPart
              key={timelineEvent.level}
              level={timelineEvent.level.toString() as SeverityLevels}
              isFirst={index === 0}
              isLast={index + 1 === timelineEvents.length}
              size={size}
              width={`${100 / timelineEvents.length}%`}
            />
          ))}
      </TimelineBar>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <time dateTime={formatDate(startDate, 'iso')}>
          {formatDate(startDate, 'axis-with-year')}
        </time>

        <time dateTime={formatDate(endDate, 'iso')}>
          {formatDate(endDate, 'axis-with-year')}
        </time>
      </Box>
    </Box>
  );
};
