import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';

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
  const { width = 0, height = 0, ref } = useResizeObserver<HTMLDivElement>();

  const left = Math.min(bounds.right - width, Math.max(0, x - width / 2));
  const top = y - height - 20;

  return (
    <TooltipContainer
      ref={ref}
      style={{
        top: 0,
        transform: `translate(${left}px,${top}px)`,
        willChange: 'transform',
        transition: 'transform 75ms ease-out',
        maxWidth: bounds.right - bounds.left,
      }}
    >
      <TooltipContent title={title}>{children}</TooltipContent>
    </TooltipContainer>
  );
}
