import { colors } from '@corona-dashboard/common';
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
          isMounted={isMounted}
          style={{
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

interface StyledTooltipContainerProps {
  isMounted: boolean;
}

const StyledTooltipContainer = styled.div<StyledTooltipContainerProps>`
  background: ${colors.white};
  border-radius: 1px;
  box-shadow: ${shadows.tooltip};
  opacity: ${(props) => (props.isMounted ? 1 : 0)};
  pointer-events: none;
  position: absolute;
  top: 0;
  will-change: transform;
  z-index: 1000;
`;

interface TriangleProps {
  isMounted: boolean;
  left: number;
  top: number;
}

function Triangle({ left, top, isMounted }: TriangleProps) {
  return (
    <StyledTriangleWrapper
      isMounted={isMounted}
      /**
       * No idea why, but we need 1.5px extra to center the arrow 🤷‍♂️
       */
      style={{ transform: `translate(calc(${left + 1.5}px - 50%), ${top}px)` }}
    >
      <StyledTriangle width={16} />
    </StyledTriangleWrapper>
  );
}

interface StyledTriangleWrapperProps {
  isMounted: boolean;
}

const StyledTriangleWrapper = styled.div<StyledTriangleWrapperProps>`
  left: 0;
  opacity: ${(props) => (props.isMounted ? 1 : 0)};
  pointer-events: none;
  position: absolute;
  top: 0;
  z-index: 1010;
`;

interface StyledTriangleProps {
  width: number;
}

const calcPythagoras = (width: number) => Math.sqrt(Math.pow(width, 2) / 2) / 2;

const StyledTriangle = styled.div<StyledTriangleProps>`
  border-color: ${colors.transparent} ${colors.transparent} ${colors.white} ${colors.white};
  border-style: solid;
  border-width: ${(props) => calcPythagoras(props.width)}px;
  box-shadow: -3px 3px 3px 0 ${colors.blackOpacity};
  box-sizing: border-box;
  height: 0;
  margin-left: -${(props) => calcPythagoras(props.width)}px;
  position: relative;
  transform-origin: 0 0;
  transform: rotate(-45deg);
  width: 0;
`;

interface TooltipContentProps {
  children?: ReactNode;
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
  title?: string;
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
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  font-size: ${fontSizes[1]};
  max-width: 440px;
`;

interface StyledTooltipHeadingWrapperProps {
  title?: string;
}

const StyledTooltipHeadingWrapper = styled.div<StyledTooltipHeadingWrapperProps>`
  align-items: center;
  color: ${colors.black};
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  padding: ${space[2]} ${space[3]};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface StyledTooltipChildrenProps {
  hasTitle?: boolean;
}

const StyledTooltipChildren = styled.div<StyledTooltipChildrenProps>`
  border-top: ${(props) => (props.hasTitle ? '1px solid' : '')};
  border-top-color: ${(props) => (props.hasTitle ? colors.gray3 : '')};
  padding: ${space[2]} ${space[3]};
`;
