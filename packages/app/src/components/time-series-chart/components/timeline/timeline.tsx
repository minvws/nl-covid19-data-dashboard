import css from '@styled-system/css';
import { memo, useCallback, useRef } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { Bounds, Padding } from '../../logic';
import { DottedTimelineBar, TimelineBar } from './components/timeline-bar';
import { TimelineEvent } from './components/timeline-event';
import { TimelineTooltipContent } from './components/tooltip-content';
import { TimelineState, useTimelineHoverHandler } from './logic';

interface TimelineProps {
  width: number;
  bounds: Bounds;
  padding: Padding;
  timelineState: TimelineState;
  size?: number;
  highlightIndex?: number;
  isYAxisCollapsed?: boolean;
}

export const Timeline = memo(function Timeline({
  width,
  padding,
  highlightIndex,
  size = 10,
  timelineState,
  isYAxisCollapsed,
}: TimelineProps) {
  const intl = useIntl();
  const { index, setIndex } = timelineState;
  const [ref, { height = 0 }] = useResizeObserver<HTMLDivElement>();

  const indexRef = useRef(index);
  indexRef.current = index;

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

  const showHistoryLine = timelineState.xOffsets[0].timeline.x0IsOutOfBounds;

  if (!width) return null;

  return (
    <Box
      ref={ref}
      position="relative"
      spacing={2}
      pb={4}
      css={css({ userSelect: 'none', touchAction: 'pan-y' })}
      width={width}
      onTouchStart={handleHover}
      onTouchMove={handleHover}
      onMouseMove={handleHover}
      onMouseLeave={handleHover}
    >
      <Box pl={padding.left}>
        <Text variant="label1" fontWeight="bold">
          {intl.siteText.charts.timeline.title}
        </Text>
      </Box>
      <Box display="flex" pl={padding.left}>
        {showHistoryLine && (
          <Box position="absolute" left={padding.left - historyLineWidth}>
            <DottedTimelineBar width={historyLineWidth} height={barHeight} />
          </Box>
        )}
        <TimelineBar width={width} height={barHeight}>
          {timelineState.events.map((x, i) => (
            <TimelineEvent
              key={`${x.start}-${x.end}`}
              range={timelineState.xOffsets[i]}
              timelineContainerRef={ref}
              size={size}
              historyEventOffset={-historyLineWidth / 2}
              onShow={() => setIndex(i)}
              onHide={() => hideTooltip(i)}
              isSelected={i === index}
              isHighlighted={isDefined(highlightIndex) && i === highlightIndex}
              tooltipContent={
                <TimelineTooltipContent
                  config={x}
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
