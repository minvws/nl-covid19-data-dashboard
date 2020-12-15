import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { colors } from '~/style/theme';

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
  primaryColor?: string;
  borderColor?: string;
  bounds: Bounds;
};

type PointProps = {
  indicatorColor: string;
};
const Point = styled.div<PointProps>`
  pointer-events: none;
  position: absolute;
  height: 18px;
  width: 18px;

  &::after {
    content: '';
    position: absolute;
    height: 8px;
    width: 8px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid white;
    background: ${(props) => props.indicatorColor || 'black'};
  }

  &::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: ${(props) => props.indicatorColor || 'black'};
    opacity: 0.2;
  }
`;

type TooltipContainerProps = {
  borderColor: string;
};
const TooltipContainer = styled.div<TooltipContainerProps>`
  pointer-events: none;
  position: absolute;
  min-width: 72;
  white-space: nowrap;
  background: white;
  border: ${(props) => `1px solid ${props.borderColor || 'black'}`};
  ${css({
    px: 2,
    py: 1,
    fontSize: 1,
  })};
`;

/**
 * @TODO improve how bounds are used to keep tooltips within the chart
 */
export function Tooltip({
  children,
  x,
  y,
  primaryColor = colors.data.primary,
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
    <>
      <Point style={{ top: y, left: x }} indicatorColor={primaryColor} />

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
    </>
  );
}
