import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';

const BOUND_OFFSET = 70;

type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type TooltipProps = {
  children: ReactNode;
  x: number;
  y: number;
  borderColor?: string;
  bounds: Bounds;
};

type TooltipContainerProps = {
  borderColor: string;
};

const TooltipContainer = styled.div<TooltipContainerProps>`
  pointer-events: none;
  position: absolute;
  min-width: 72;
  white-space: nowrap;
  background: white;
  outline: 1px solid transparent;
  border: ${(props) => `1px solid ${props.borderColor || 'black'}`};
  ${css({
    px: 2,
    py: 1,
    fontSize: 1,
  })};
  z-index: 100;
`;

/**
 * @TODO improve how bounds are used to keep tooltips within the chart
 */
export function Tooltip({
  children,
  x,
  y,
  borderColor = '#01689B',
  bounds,
}: TooltipProps) {
  const yTransform = 'calc(-100% - 10px)';

  let xTransform = '-50%';
  if (x > bounds.right - BOUND_OFFSET) {
    xTransform = `calc(-100% + ${bounds.right - x}px)`;
  }
  if (x < bounds.left + BOUND_OFFSET) {
    xTransform = `calc(-50% + ${BOUND_OFFSET - x}px)`;
  }

  return (
    <TooltipContainer
      style={{
        top: y,
        left: x,
        transform: `translate(${xTransform},${yTransform})`,
        transition: 'left 0.075s, top 0.075s',
      }}
      borderColor={borderColor}
    >
      {children}
    </TooltipContainer>
  );
}
