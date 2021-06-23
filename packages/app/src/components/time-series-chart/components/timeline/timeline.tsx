import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { memo, useCallback, useRef } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { Bounds, Padding, TimelineEventConfig } from '../../logic';
import { DottedTimelineBar, TimelineBar } from './components/bar';
import { TimelineEvent } from './components/event';
import { TimelineTooltipContent } from './components/tooltip-content';

interface TimelineProps {
  events: TimelineEventConfig[];
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  bounds: Bounds;
  padding: Padding;
  index: number | undefined;
  setIndex: (index: number | undefined) => void;
  size?: number;
  highlightIndex?: number;
  isFullTimeline?: boolean;
}

export const Timeline = memo(function Timeline({
  events,
  xScale,
  padding,
  highlightIndex,
  size = 10,
  index,
  setIndex,
  isFullTimeline,
}: TimelineProps) {
  const isTouch = useIsTouchDevice();
  const [, end] = xScale.domain();
  const width = xScale(end) ?? 0;

  const indexRef = useRef(index);
  indexRef.current = index;

  const hideTooltip = useCallback(
    (index: number) => indexRef.current === index && setIndex(undefined),
    [setIndex]
  );

  if (!width) return null;

  const barHeight = size + 4;

  return (
    <Box
      display="flex"
      position="relative"
      left={isFullTimeline ? padding.left : 0}
      css={css({ userSelect: 'none' })}
      key={isTouch ? 1 : 0}
    >
      {!isFullTimeline && (
        <DottedTimelineBar width={padding.left} height={barHeight} />
      )}
      <TimelineBar width={width} height={barHeight}>
        {events.map((x, i) => (
          <TimelineEvent
            key={x.date.toString()}
            size={size}
            config={x}
            xScale={xScale}
            index={i}
            onShow={setIndex}
            onHide={hideTooltip}
            isSelected={i === index}
            isHighlighted={isDefined(highlightIndex) && i === highlightIndex}
            tooltipContent={
              <TimelineTooltipContent
                value={x}
                onNext={() => setIndex(i + 1)}
                onPrev={() => setIndex(i - 1)}
                onClose={() => hideTooltip(i)}
              />
            }
          />
        ))}
      </TimelineBar>
    </Box>
  );
});
