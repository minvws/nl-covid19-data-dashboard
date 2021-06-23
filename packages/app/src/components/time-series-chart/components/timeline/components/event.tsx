import css from '@styled-system/css';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { ReactNode, RefObject, useRef } from 'react';
import styled from 'styled-components';
import { WithTooltip } from '~/lib/tooltip';
import { colors } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { TimelineEventRange } from '../logic';
import { TimelineMarker } from './marker';

interface TimelineEventProps {
  range: TimelineEventRange;
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

  const x0 = range.timeline.start;
  const x1 = range.timeline.end;

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
          disableBorderRadius={range.timeline.endIsOutOfBounds}
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
          left: range.timeline.startIsOutOfBounds ? historyEventOffset : 0,
        }}
      >
        <div css={css({ transform: 'translateX(-50%)' })}>
          <TooltipTrigger
            content={tooltipContent}
            isSelected={isSelected}
            contentRef={contentRef}
            onFocus={onShow}
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
}: {
  content: ReactNode;
  isSelected: boolean;
  contentRef: RefObject<HTMLDivElement>;
  children: ReactNode;
  onFocus: () => void;
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
      <div tabIndex={0} onFocus={onFocus} aria-role="text">
        {children}
      </div>
    </WithTooltip>
  ) : (
    <WithTooltip
      content={contentWithRef}
      placement="bottom"
      interactive={false}
      visible={isSelected}
    >
      <div tabIndex={0} onFocus={onFocus} aria-role="text">
        <div aria-hidden>{children}</div>
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
