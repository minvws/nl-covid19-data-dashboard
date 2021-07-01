import css from '@styled-system/css';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { ReactNode, RefObject, useRef } from 'react';
import styled from 'styled-components';
import { WithTooltip } from '~/lib/tooltip';
import { colors } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { TimelineEventXOffset } from '../logic';
import { TimelineMarker } from './timeline-marker';

interface TimelineEventProps {
  range: TimelineEventXOffset;
  size: number;
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
  range,
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

  const { x0, x1, x0IsOutOfBounds, x1IsOutOfBounds } = range.timeline;

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
          disableBorderRadius={x1IsOutOfBounds}
          initial={false}
          animate={{
            background: transparentize(
              isHighlightedEvent ? 0.4 : 0.7,
              colors.data.primary
            ),
          }}
        />
      )}
      <div
        style={{
          position: 'relative',
          left: x0IsOutOfBounds ? historyEventOffset : 0,
        }}
      >
        <div css={css({ transform: 'translateX(-50%)' })}>
          <TooltipTrigger
            content={tooltipContent}
            isSelected={isSelected}
            contentRef={contentRef}
            onFocus={onShow}
            onBlur={onHide}
          >
            <TimelineMarker size={size} isHighlighted={isHighlightedEvent} />
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
  onFocus,
  onBlur,
}: {
  content: ReactNode;
  isSelected: boolean;
  contentRef: RefObject<HTMLDivElement>;
  children: ReactNode;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const isTouch = useIsTouchDevice();
  const contentWithRef = <div ref={contentRef}>{content}</div>;

  return (
    <WithTooltip
      content={contentWithRef}
      placement="bottom"
      interactive={isTouch}
      visible={isSelected}
    >
      <div
        tabIndex={0}
        onFocus={onFocus}
        onBlur={onBlur}
        /**
         * Somehow without the aria-role='text' the screenreader won't read the
         * tooltip content..?
         */
        aria-role="text"
      >
        {children}
      </div>
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
