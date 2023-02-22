import css from '@styled-system/css';
import { memo, useCallback, useRef } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
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

export const Timeline = memo(function Timeline({ width, padding, highlightIndex, size = 10, timelineState, isYAxisCollapsed }: TimelineProps) {
  const { commonTexts } = useIntl();
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

  const hideTooltip = useCallback((index: number) => indexRef.current === index && setIndex(undefined), [setIndex]);

  const barHeight = size;
  const historyLineWidth = isYAxisCollapsed ? 15 : Math.min(padding.left, 23);

  const showHistoryLine = timelineState.xOffsets[0].timeline.x0IsOutOfBounds;

  if (!width) return null;

  return (
    <Box
      ref={ref}
      position="relative"
      spacing={2}
      paddingBottom={space[4]}
      css={css({ userSelect: 'none', touchAction: 'pan-y' })}
      width={width}
      onTouchStart={handleHover}
      onTouchMove={handleHover}
      onMouseMove={handleHover}
      onMouseLeave={handleHover}
    >
      <Box paddingLeft={padding.left}>
        <BoldText variant="label1">{commonTexts.charts.timeline.title}</BoldText>
      </Box>
      <Box display="flex" paddingLeft={padding.left}>
        {showHistoryLine && (
          <Box position="absolute" left={padding.left - historyLineWidth}>
            <DottedTimelineBar width={historyLineWidth} height={barHeight} />
          </Box>
        )}
        <TimelineBar width={width} height={barHeight}>
          {timelineState.events.map((x, i) => (
            <TimelineEvent
              key={`${x.start}-${i}`}
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
                  hasMultipleEvents={timelineState.events.length > 1}
                />
              }
            />
          ))}
        </TimelineBar>
      </Box>
    </Box>
  );
});
