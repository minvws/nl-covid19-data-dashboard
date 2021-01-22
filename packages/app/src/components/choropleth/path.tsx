import css from '@styled-system/css';
import styled from 'styled-components';

interface PathProps {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  id?: string;
  isHoverable?: boolean;
  isClickable?: boolean;
}

export function Path({
  id,
  d,
  fill,
  stroke,
  strokeWidth,
  isHoverable,
  isClickable,
}: PathProps) {
  return (
    <StyledPath
      d={d}
      shapeRendering="optimizeQuality"
      data-id={id}
      isHoverable={isHoverable}
      isClickable={isClickable}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

const StyledPath = styled.path<{
  isHoverable?: boolean;
  isClickable?: boolean;
}>(
  (x) =>
    css({
      fill: x.fill || 'transparent',
      stroke: x.stroke,
      strokeWidth: x.strokeWidth || 0.5,
      pointerEvents: 'none',

      transitionProperty: 'fill, stroke, stroke-width',
      transitionDuration: '120ms, 90ms',
      transitionTimingFunction: 'ease-out',
    }),
  (x) =>
    x.isHoverable &&
    css({
      cursor: x.isClickable ? 'pointer' : 'default',
      fill: 'transparent',
      stroke: x.stroke ?? 'transparent',
      strokeWidth: x.strokeWidth ?? 0,
      pointerEvents: 'all',
      '&:hover': {
        transitionDuration: '0ms',
        fill: x.fill ?? 'none',
        stroke: x.stroke ?? '#222',
        strokeWidth: x.strokeWidth ?? 2,
      },
    })
);
