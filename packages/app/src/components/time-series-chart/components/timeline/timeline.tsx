import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { memo, useCallback, useRef } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { Bounds, Padding, TimelineEventConfig } from '../../logic';
import { DottedTimelineBar, TimelineBar } from './components/bar';
import { TimelineEvent } from './components/event';
import { TimelineTooltipContent } from './components/tooltip-content';
import { useTimelineHoverHandler } from './logic';

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
  isYAxisCollapsed?: boolean;
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
  isYAxisCollapsed,
}: TimelineProps) {
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();
  const [, end] = xScale.domain();
  const width = xScale(end) ?? 0;

  const indexRef = useRef(index);
  indexRef.current = index;

  const handleHover = useTimelineHoverHandler(setIndex, {
    xScale,
    events,
    padding,
    width,
  });

  const hideTooltip = useCallback(
    (index: number) => indexRef.current === index && setIndex(undefined),
    [setIndex]
  );

  if (!width) return null;

  const barHeight = size;
  const historyLineWidth = isYAxisCollapsed ? 15 : Math.min(padding.left, 23);

  return (
    <Box
      /**
       * remount to bypass buggy tippy.js behavior when switching between touch
       * vs non-touch mode
       */
      key={isTouch ? 1 : 0}
      ref={timelineContainerRef}
      position="relative"
      pb={3}
      spacing={2}
      css={css({ userSelect: 'none' })}
      onTouchStart={handleHover}
      onTouchMove={handleHover}
      onMouseMove={handleHover}
      onMouseLeave={handleHover}
    >
      <Box pl={padding.left}>
        <Text fontSize={1} fontWeight="bold">
          Bekijk uitgelichte gebeurtenissen
        </Text>
      </Box>
      <Box display="flex" pl={padding.left}>
        {!isFullTimeline && (
          <Box position="absolute" left={padding.left - historyLineWidth}>
            <DottedTimelineBar width={historyLineWidth} height={barHeight} />
          </Box>
        )}
        <TimelineBar width={width} height={barHeight}>
          {events.map((x, i) => (
            <TimelineEvent
              key={x.date.toString()}
              timelineContainerRef={timelineContainerRef}
              size={size}
              config={x}
              xScale={xScale}
              historyEventOffset={-historyLineWidth / 2}
              onShow={() => setIndex(i)}
              onHide={() => hideTooltip(i)}
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
    </Box>
  );
});
