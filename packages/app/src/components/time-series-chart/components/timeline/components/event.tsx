import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { ReactElement, ReactNode, RefObject, useRef } from 'react';
import styled from 'styled-components';
import { TimelineEventConfig } from '~/components/time-series-chart/logic';
import { WithTooltip } from '~/lib/tooltip';
import { colors } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { getTimelineEventRange } from '../logic';
import { TimelineMarker } from './marker';

interface TimelineEventProps {
  config: TimelineEventConfig;
  size: number;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  onShow: () => void;
  onHide: () => void;
  isSelected: boolean;
  tooltipContent: ReactNode;
  historyEventOffset: number;
  isHighlighted?: boolean;
  timelineContainerRef: RefObject<HTMLDivElement>;
}

export function TimelineEvent({
  timelineContainerRef,
  config,
  xScale,
  size,
  onShow,
  onHide,
  isSelected,
  isHighlighted,
  tooltipContent,
  historyEventOffset,
}: TimelineEventProps) {
  const annotationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useOnClickOutside([timelineContainerRef, annotationRef, contentRef], onHide);

  const isHighlightedEvent = isHighlighted || isSelected;

  const eventRange = getTimelineEventRange(config, xScale.domain());

  const x0 = xScale(eventRange.timeline.start) as number;
  const x1 = xScale(eventRange.timeline.end) as number;

  const timespanWidth = x1 - x0;

  return (
    <StyledEvent
      style={{
        width: timespanWidth,
        left: x0,
        zIndex: isHighlightedEvent ? 1 : undefined,
      }}
    >
      {timespanWidth > 0 && (
        <TimespanBar
          height={size}
          disableBorderRadius={eventRange.timeline.endIsOutOfBounds}
          initial={false}
          animate={{
            background: transparentize(
              isHighlightedEvent ? 0.5 : 0.8,
              colors.data.primary
            ),
          }}
        />
      )}
      <div
        style={{
          position: 'relative',
          left: eventRange.timeline.startIsOutOfBounds ? historyEventOffset : 0,
        }}
      >
        <div css={css({ transform: 'translateX(-50%)' })}>
          <TooltipTrigger
            content={tooltipContent}
            isSelected={isSelected}
            contentRef={contentRef}
          >
            <div tabIndex={0} onFocus={onShow}>
              <TimelineMarker size={size} isHighlighted={isHighlightedEvent} />
            </div>
          </TooltipTrigger>
        </div>
      </div>
    </StyledEvent>
  );
}

function TooltipTrigger({
  isSelected,
  content,
  contentRef,
  children,
}: {
  content: ReactNode;
  isSelected: boolean;
  contentRef: RefObject<HTMLDivElement>;
  children: ReactElement;
}) {
  const isTouch = useIsTouchDevice();
  const contentWithRef = <div ref={contentRef}>{content}</div>;

  return isTouch ? (
    <WithTooltip
      content={contentWithRef}
      placement="bottom"
      interactive={true}
      visible={isSelected}
    >
      {children}
    </WithTooltip>
  ) : (
    <WithTooltip
      content={contentWithRef}
      placement="bottom"
      interactive={false}
      visible={isSelected}
    >
      {children}
    </WithTooltip>
  );
}

const StyledEvent = styled.div(
  css({
    position: 'absolute',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  })
);

const TimespanBar = styled(motion.div)<{
  height: number;
  disableBorderRadius?: boolean;
}>((x) =>
  css({
    position: 'absolute',
    width: '100%',
    height: x.height,
    borderRadius: x.disableBorderRadius
      ? undefined
      : `0 ${x.height / 2}px ${x.height / 2}px 0`,
  })
);
