import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { space, fontSizes, shadows } from '~/style/theme';
import { isDefined } from 'ts-is-present';
import { BoldText } from '~/components/typography';
import { useBoundingBox } from '~/utils/use-bounding-box';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useViewport } from '~/utils/use-viewport';
import { Bounds, Padding } from '../../logic';

interface TooltipWrapperProps {
  title?: string;
  children: React.ReactNode;
  left: number;
  top: number;
  bounds: Bounds;
  padding: Padding;
}

const VIEWPORT_PADDING = 10;

/**
 * The Tooltip will always be rendered inside the viewport. Calculations
 * are quite messy and need to be cleaned up / refactored, but it does the
 * trick for now.
 *
 * @TODO clean up calculations in Tooltip component
 */
export function TooltipWrapper({ title, children, left, top: _top, bounds, padding }: TooltipWrapperProps) {
  const viewportSize = useViewport();
  const isMounted = useIsMounted({ delayMs: 10 });
  const [ref, { width = 0, height = 0 }] = useResizeObserver<HTMLDivElement>();
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();

  const targetY = -height;
  const targetX = left + padding.left;

  const maxWidth = Math.min(bounds.width + padding.left + padding.right, viewportSize.width - VIEWPORT_PADDING * 2);

  const relativeLeft = boundingBox?.left ?? 0;

  const minLeft = -relativeLeft + VIEWPORT_PADDING;
  const maxLeft = viewportSize.width - width - relativeLeft - VIEWPORT_PADDING;

  const y = targetY;
  const x = Math.max(
    minLeft, // stay within left side of viewport
    Math.min(
      targetX - width / 2, // center tooltip
      maxLeft // stay within right side of viewport
    )
  );

  return (
    <>
      <div ref={boundingBoxRef}>
        <StyledTooltipContainer
          ref={ref}
          style={{
            opacity: isMounted ? 1 : 0,
            /**
             * No idea why, but we need to align the div at half pixels to avoid
             * blurry text 🤷‍♂️ (non-retina screen)
             */
            transform: `translate(${Math.floor(x) + 0.5}px,${y}px)`,
            maxWidth,
          }}
        >
          <TooltipContent title={title}>{children}</TooltipContent>
        </StyledTooltipContainer>
      </div>
      <Triangle left={targetX} top={targetY + height} isMounted={isMounted} />
    </>
  );
}

const StyledTooltipContainer = styled.div`
  position: absolute;
  background: ${colors.white};
  box-shadow: ${shadows.tooltip};
  pointer-events: none;
  z-index: 1000;
  border-radius: 1px;
  top: 0;
  will-change: transform;
`;

interface TriangleProps {
  left: number;
  top: number;
  isMounted: boolean;
}

function Triangle({ left, top, isMounted }: TriangleProps) {
  return (
    <StyledTriangleWrapper
      isMounted={isMounted}
      left={left}
      top={top}
      /**
       * No idea why, but we need 1.5px extra to center the arrow 🤷‍♂️
       */
      style={transform}
    >
      <StyledTriangle width={16} />
    </StyledTriangleWrapper>
  );
}

interface StyledTriangleWrapperProps {
  left: number;
  top: number;
  isMounted: boolean;
}

const StyledTriangleWrapper = styled.div<StyledTriangleWrapperProps>`
  opacity: ${(props) => (props.isMounted ? 1 : 0)};
  position: 'absolute';
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  z-index: 1010;
  pointer-events: 'none';
  transform: ${(props) => translate(calc(props.left + 1.5 + 'px' - '50%'), props.top + 'px')};
`;

interface StyledTriangleProps {
  width: number;
}
const StyledTriangle = styled.div<StyledTriangleProps>((x) => {
  /**
   *  🙏  pythagoras
   */
  const borderWidth = Math.sqrt(Math.pow(x.width, 2) / 2) / 2;

  return css({
    position: 'relative',
    width: 0,
    height: 0,
    marginLeft: -borderWidth,
    boxSizing: 'border-box',
    borderWidth,
    borderStyle: 'solid',
    borderColor: 'transparent transparent white white',
    transformOrigin: '0 0',
    transform: 'rotate(-45deg)',
    boxShadow: `-3px 3px 3px 0 ${colors.blackOpacity}`,
  });
});

interface TooltipContentProps {
  title?: string;
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
}

function TooltipContent(props: TooltipContentProps) {
  const { title, onSelect, children } = props;

  return (
    <StyledTooltipContent onClick={onSelect} aria-live="polite">
      {title && <TooltipHeading title={title} />}
      {children && <StyledTooltipChildren hasTitle={isDefined(title)}>{children}</StyledTooltipChildren>}
    </StyledTooltipContent>
  );
}

function TooltipHeading({ title }: { title: string }) {
  return (
    <StyledTooltipHeadingWrapper>
      <BoldText variant="label1">{title}</BoldText>
    </StyledTooltipHeadingWrapper>
  );
}

interface StyledTooltipContentProps {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const StyledTooltipContent = styled.div<StyledTooltipContentProps>`
  border-radius: 1px;
  color: ${colors.black};
  cursor: ${(x) => (x.onClick ? 'pointer' : 'default')};
  font-size: ${fontSizes[1]};
  max-width: 440px;
`;

interface StyledTooltipHeadingWrapperProps {
  title?: string;
}

const StyledTooltipHeadingWrapper = styled.div<StyledTooltipHeadingWrapperProps>`
  align-items: 'center';
  color: ${colors.black};
  display: 'flex';
  justify-content: 'space-between';
  overflow: 'hidden';
  padding: ${space[2]} ${space[3]};
  text-overflow: 'ellipsis';
  white-space: 'nowrap';
`;

interface StyledTooltipChildrenProps {
  hasTitle?: boolean;
}

const StyledTooltipChildren = styled.div<StyledTooltipChildrenProps>`
  border-top: ${(props) => (props.hasTitle ? '1px solid' : '')};
  border-top-color: ${(props) => (props.hasTitle ? colors.gray3 : '')};
  padding: ${space[2]} ${space[3]};
`;
