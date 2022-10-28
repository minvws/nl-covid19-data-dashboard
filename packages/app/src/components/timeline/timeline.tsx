import { space } from '~/style/theme';
import { Box } from '../base';
import { SeverityLevels } from '../severity-indicator-tile/types';
import { TimelineBar } from './timeline-bar';
import { TimelineBarPart } from './timeline-bar-part';

interface TimelineProps {
  timelineEvents?: ThermometerEventConfig[];
  size?: number;
}

interface ThermometerEventConfig {
  title: string;
  description: string;
  start: number;
  end?: number;
  level: number;
}

export const Timeline = ({ timelineEvents, size = 10 }: TimelineProps) => {
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
    </Box>
  );
};
