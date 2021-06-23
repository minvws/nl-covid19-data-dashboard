import css from '@styled-system/css';
import { memo, useCallback, useRef } from 'react';
import { isDefined } from 'ts-is-present';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { Bounds, Padding } from '../../logic';
import { DottedTimelineBar, TimelineBar } from './components/bar';
import { TimelineEvent } from './components/event';
import { TimelineTooltipContent } from './components/tooltip-content';
import { TimelineState, useTimelineHoverHandler } from './logic';

interface TimelineProps {
  width: number;
  bounds: Bounds;
  padding: Padding;
  timelineState: TimelineState;
  size?: number;
  highlightIndex?: number;
  isFullTimeline?: boolean;
  isYAxisCollapsed?: boolean;
}

export const Timeline = memo(function Timeline({
  width,
  padding,
  highlightIndex,
  size = 10,
  timelineState,
  isFullTimeline,
  isYAxisCollapsed,
}: TimelineProps) {
  const { index, setIndex } = timelineState;
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const { height = 0 } = useResizeObserver({ ref: timelineContainerRef });
  useResizeObserver();
  const isTouch = useIsTouchDevice();

  const indexRef = useRef(timelineState.index);
  indexRef.current = timelineState.index;

  const handleHover = useTimelineHoverHandler(setIndex, {
    timelineState,
    padding,
    width,
    height,
  });

  const hideTooltip = useCallback(
    (index: number) => indexRef.current === index && setIndex(undefined),
    [setIndex]
  );

  const barHeight = size;
  const historyLineWidth = isYAxisCollapsed ? 15 : Math.min(padding.left, 23);

  if (!width) return null;

  return (
    <Box
      /**
       * remount to bypass buggy tippy.js behavior when switching between touch
       * vs non-touch mode
       */
      key={isTouch ? 1 : 0}
      ref={timelineContainerRef}
      position="relative"
      spacing={2}
      pb={3}
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
          {timelineState.events.map((x, i) => (
            <TimelineEvent
              key={x.date.toString()}
              range={timelineState.ranges[i]}
              timelineContainerRef={timelineContainerRef}
              size={size}
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
