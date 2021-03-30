/**
 * The default tooltip `TooltipSeriesList` can now display the full contents of
 * the series config with colors and all, instead of a single default item.
 */
import { TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import useResizeObserver from 'use-resize-observer';
import { Heading } from '~/components-styled/typography';
import { useBoundingBox } from '~/utils/use-bounding-box';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useViewport } from '~/utils/use-viewport';
import { Bounds, Padding } from '../../logic';
import { TooltipSeriesList } from './tooltip-series-list';
import { TooltipData, TooltipFormatter } from './types';

interface TooltipProps<T extends TimestampedValue> {
  title?: string;
  data: TooltipData<T>;
  left: number;
  top: number;
  bounds: Bounds;
  padding: Padding;
  formatTooltip?: TooltipFormatter<T>;
}

const VIEWPORT_PADDING = 10;

/**
 * The Tooltip will always be rendered inside the viewport. Calculations
 * are quite messy and need to be cleaned up / refactored, but it does the
 * trick for now.
 *
 * @TODO clean up calculations in Tooltip component
 */
export function Tooltip<T extends TimestampedValue>({
  title,
  data: tooltipData,
  left,
  top: _top,
  formatTooltip,
  bounds,
  padding,
}: TooltipProps<T>) {
  const viewportSize = useViewport();
  const isMounted = useIsMounted({ delayMs: 10 });
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0, height = 0 } = useResizeObserver<HTMLDivElement>({ ref });
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();

  /**
   * nudge the top to render the tooltip a little bit on top of the chart
   */
  const targetY = -height + 8;
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

  const content =
    typeof formatTooltip === 'function' ? (
      formatTooltip(tooltipData)
    ) : (
      <TooltipSeriesList data={tooltipData} />
    );

  if (!content) return null;

  return (
    <div ref={boundingBoxRef}>
      <TooltipContainer
        ref={ref}
        style={{
          opacity: isMounted ? 1 : 0,
          transform: `translate(${Math.round(x)}px,${Math.round(y)}px)`,
          maxWidth,
        }}
      >
        <TooltipContent title={title}>{content}</TooltipContent>
      </TooltipContainer>
      <Triangle left={targetX} top={targetY + height} isMounted={isMounted} />
    </div>
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
      style={{ transform: `translate(${left}px, ${top}px)` }}
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
    position: 'absolute',
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

export function TooltipContent(props: TooltipContentProps) {
  const { title, onSelect, children } = props;

  return (
    <StyledTooltipContent onClick={onSelect}>
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
      })}
    >
      <Heading
        level={3}
        m={0}
        fontSize={1}
        css={css({ overflow: 'hidden', textOverflow: 'ellipsis' })}
      >
        {title}
      </Heading>
    </div>
  );
}

export const TooltipChildren = styled.div<{ hasTitle?: boolean }>(
  ({ hasTitle }) =>
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
    maxWidth: 350,
    borderRadius: 1,
    cursor: x.onClick ? 'pointer' : 'default',
    fontSize: 1,
  })
);
