// import { colors } from '@corona-dashboard/common';
// import { Box } from '../base';
// import { getSeverityColor } from '../severity-indicator-tile/logic/get-severity-color';
// import {
//   SeverityLevel,
//   SeverityLevels,
// } from '../severity-indicator-tile/types';

// interface TimelineEventProps {
//   level: SeverityLevel;
//   size: number;
//   isFirst?: boolean;
// }

// export const TimelineEvent = ({ level, size, isFirst }: TimelineEventProps) => {
//   return (
//     <Box
//       backgroundColor={colors.white}
//       border={`2px solid ${getSeverityColor(level as SeverityLevels)}`}
//       borderRadius={`${size / 2}px`}
//       height={size}
//       width={size}
//       position="absolute"
//       left={!isFirst ? `-${size / 2}px` : null}
//     />
//   );
// };

import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { m } from 'framer-motion';
import { transparentize } from 'polished';
import { ReactNode, RefObject, useRef } from 'react';
import styled from 'styled-components';
import { WithTooltip } from '~/lib/tooltip';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useUniqueId } from '~/utils/use-unique-id';
import { TimelineMarker } from '../time-series-chart/components/timeline';
import { TimelineEventXOffset } from '../time-series-chart/components/timeline/logic';
// import { TimelineEventXOffset } from '../logic';
// import { TimelineMarker } from './timeline-marker';

interface TimelineEventProps {
  isSelected: boolean;
  onHide: () => void;
  onShow: () => void;
  size: number;
  timelineContainerRef: RefObject<HTMLDivElement>;
  tooltipContent: ReactNode;
  color?: string;
  historyEventOffset?: number;
  isHighlighted?: boolean;
  range?: TimelineEventXOffset;
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
  color = colors.primary,
}: TimelineEventProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  useOnClickOutside([timelineContainerRef, contentRef], onHide);

  const isHighlightedEvent = isHighlighted || isSelected;

  const { x0, x1, x0IsOutOfBounds, x1IsOutOfBounds } = range?.timeline ?? {};

  const timespanWidth = x0 && x1 ? x1 - x0 : 0;

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
          $disableBorderRadius={x1IsOutOfBounds}
          initial={false}
          animate={{
            background: transparentize(isHighlightedEvent ? 0.4 : 0.7, color),
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
            <TimelineMarker
              size={size}
              isHighlighted={isHighlightedEvent}
              color={color}
            />
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
  const breakpoints = useBreakpoints();
  const isTouch = useIsTouchDevice();
  const uniqueId = useUniqueId();

  const contentWithRef = (
    <div ref={contentRef} id={uniqueId}>
      {content}
    </div>
  );

  return (
    <WithTooltip
      content={contentWithRef}
      placement="bottom"
      interactive={isTouch}
      visible={isSelected}
      maxWidth={breakpoints.sm ? '360px' : '100%'}
    >
      <div
        tabIndex={0}
        onFocus={onFocus}
        /**
         * disable blur events for touch devices, we don't want to hide the
         * tooltip when a user navigates through the tooltips using prev/next
         */
        onBlur={isTouch ? undefined : onBlur}
        role="group"
        aria-labelledby={uniqueId}
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

const TimespanBar = styled(m.div)<{
  height: number;
  $disableBorderRadius?: boolean; // Prevent prop to be rendered to the DOM by using Transient prop
}>((x) =>
  css({
    position: 'absolute',
    width: '100%',
    height: x.height,
    borderRadius: x.$disableBorderRadius
      ? undefined
      : `0 ${x.height / 2}px ${x.height / 2}px 0`,
  })
);
