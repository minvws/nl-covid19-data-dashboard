import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components-styled/base';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { useIsMounted } from '~/utils/use-is-mounted';

type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type TooltipProps = {
  children: ReactNode;
  title: string;
  x: number;
  y: number;
  bounds: Bounds;
};

const TooltipContainer = styled.div(
  css({
    position: 'absolute',
    bg: 'white',
    boxShadow: 'tile',
    pointerEvents: 'none',
    zIndex: 1000,
    borderRadius: 1,
  })
);

export function Tooltip({ children, title, x, y, bounds }: TooltipProps) {
  const isMounted = useIsMounted({ delayMs: 1 });
  const { width = 0, height = 0, ref } = useResizeObserver<HTMLDivElement>();

  const left = Math.min(bounds.right - width, Math.max(0, x - width / 2));
  const top = y - height - 30;

  /**
   * Alternative algorithm to position the tooltip next to the point, instead
   * of above the point. Might be useful in the future.
   *
   * let left = x + 20;
   * let top = y - height / 2;
   *
   * left = left + width >= bounds.right ? x - width - 20 : left;
   *
   * if (left < bounds.left) {
   *   left =
   *     left < bounds.left
   *       ? Math.min(bounds.right - width, Math.max(0, x - width / 2))
   *       : left;
   *
   *   top = y - height - 20;
   * }
   */

  return (
    <TooltipContainer
      ref={ref}
      style={{
        top: 0,
        opacity: isMounted ? 1 : 0,
        transform: `translate(${left}px,${top}px)`,
        willChange: 'transform',
        transition: `transform ${isMounted ? '75ms' : '0ms'} ease-out`,
        maxWidth: bounds.right - bounds.left,
      }}
    >
      <TooltipContent title={title}>{children}</TooltipContent>
    </TooltipContainer>
  );
}

type DateTooltipProps = {
  children: ReactNode;
  x: number;
  y: number;
  bounds: Bounds;
};

export function DateTooltip({ children, x, y, bounds }: DateTooltipProps) {
  const { width = 0, ref } = useResizeObserver<HTMLDivElement>();
  const left = Math.min(bounds.right - width, Math.max(0, x - width / 2));
  const top = y;

  return (
    <Box
      ref={ref}
      bg="white"
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate(${left}px,${top}px)`,
        transitionProperty: 'transform',
        transitionDuration: '75ms',
        transitionTimingFunction: 'ease-out',
      }}
      color="data.benchmark"
      fontSize={1}
      fontWeight="bold"
    >
      <Box px={2} py={1}>
        {children}
      </Box>
    </Box>
  );
}
