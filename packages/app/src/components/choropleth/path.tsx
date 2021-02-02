import css from '@styled-system/css';
import styled from 'styled-components';

interface PathProps {
  pathData: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  id?: string;
  isClickable?: boolean;
}

export function Path({
  id,
  pathData,
  fill,
  stroke,
  strokeWidth,
  isClickable,
}: PathProps) {
  return (
    <StyledPath
      d={pathData}
      shapeRendering="optimizeQuality"
      data-id={id}
      isClickable={isClickable}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

export function HoverPath({
  id,
  pathData,
  fill,
  stroke,
  strokeWidth,
  isClickable,
}: PathProps) {
  return (
    <StyledHoverPath
      d={pathData}
      shapeRendering="optimizeQuality"
      data-id={id}
      isClickable={isClickable}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

const StyledPath = styled.path<{
  isClickable?: boolean;
}>((x) =>
  css({
    fill: x.fill || 'transparent',
    stroke: 'x.stroke',
    strokeWidth: x.strokeWidth || 0.5,
    pointerEvents: 'none',

    transitionProperty: 'fill, stroke, stroke-width',
    transitionDuration: '120ms, 90ms',
    transitionTimingFunction: 'ease-out',
  })
);

const StyledHoverPath = styled.path<{
  isClickable?: boolean;
}>((x) =>
  css({
    fill: 'transparent',
    transitionProperty: 'fill, stroke, stroke-width',
    transitionDuration: '120ms, 90ms',
    transitionTimingFunction: 'ease-out',
    cursor: x.isClickable ? 'pointer' : 'default',
    stroke: 'transparent',
    strokeWidth: 0,
    pointerEvents: 'all',
    '&:hover': {
      transitionDuration: '0ms',
      fill: x.fill ?? 'none',
      stroke: x.stroke ?? '#000',
      strokeWidth: x.strokeWidth ?? 2,
    },
  })
);
