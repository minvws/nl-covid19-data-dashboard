import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Text } from '~/components/typography';
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
export function TooltipWrapper({
  title,
  children,
  left,
  top: _top,
  bounds,
  padding,
}: TooltipWrapperProps) {
  const viewportSize = useViewport();
  const isMounted = useIsMounted({ delayMs: 10 });
  const [ref, { width = 0, height = 0 }] = useResizeObserver<HTMLDivElement>();
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();

  const targetY = -height;
  const targetX = left + padding.left;

  const maxWidth = Math.min(
    bounds.width + padding.left + padding.right,
    viewportSize.width - VIEWPORT_PADDING * 2
  );

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
        <TooltipContainer
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
        </TooltipContainer>
      </div>
      <Triangle left={targetX} top={targetY + height} isMounted={isMounted} />
    </>
  );
}

interface TriangleProps {
  left: number;
  top: number;
  isMounted: boolean;
}

function Triangle({ left, top, isMounted }: TriangleProps) {
  return (
    <div
      css={css({
        opacity: isMounted ? 1 : 0,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1010,
        pointerEvents: 'none',
      })}
      /**
       * No idea why, but we need 1.5px extra to center the arrow 🤷‍♂️
       */
      style={{ transform: `translate(calc(${left + 1.5}px - 50%), ${top}px)` }}
    >
      <StyledTriangle width={16} />
    </div>
  );
}

const StyledTriangle = styled.div<{ width: number }>((x) => {
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
    borderColor: 'transparent transparent #fff #fff',
    transformOrigin: '0 0',
    transform: 'rotate(-45deg)',
    boxShadow: '-3px 3px 3px 0 rgba(0, 0, 0, 0.05)',
  });
});

const TooltipContainer = styled.div(
  css({
    position: 'absolute',
    bg: 'white',
    boxShadow: 'tooltip',
    pointerEvents: 'none',
    zIndex: 1000,
    borderRadius: 1,
    top: 0,
    willChange: 'transform',
  })
);

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
      {children && (
        <TooltipChildren hasTitle={isDefined(title)}>
          {children}
        </TooltipChildren>
      )}
    </StyledTooltipContent>
  );
}

function TooltipHeading({ title }: { title: string }) {
  return (
    <div
      css={css({
        whiteSpace: 'nowrap',
        color: 'body',
        py: 2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      })}
    >
      <Text variant="label1" fontWeight="bold">
        {title}
      </Text>
    </div>
  );
}

const TooltipChildren = styled.div<{ hasTitle?: boolean }>(({ hasTitle }) =>
  css({
    borderTop: hasTitle ? '1px solid' : '',
    borderTopColor: hasTitle ? 'border' : '',
    py: 2,
    px: 3,
  })
);

const StyledTooltipContent = styled.div((x) =>
  css({
    color: 'body',
    maxWidth: 375,
    borderRadius: 1,
    cursor: x.onClick ? 'pointer' : 'default',
    fontSize: 1,
  })
);
