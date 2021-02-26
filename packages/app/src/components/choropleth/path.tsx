import css from '@styled-system/css';
import styled from 'styled-components';

interface PathProps {
  pathData: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  id?: string;
  isClickable?: boolean;
  isSelected?: boolean;
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
  isSelected,
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
      isSelected={isSelected}
    />
  );
}

const StyledPath = styled.path<{
  isClickable?: boolean;
}>((x) =>
  css({
    fill: x.fill || 'transparent',
    stroke: x.stroke,
    strokeWidth: x.strokeWidth || 0.5,
    pointerEvents: 'none',
  })
);

const StyledHoverPath = styled.path<{
  isClickable?: boolean;
  isSelected?: boolean;
}>((x) =>
  css({
    fill: 'transparent',
    transitionProperty: 'fill, stroke, stroke-width',
    transitionDuration: '120ms, 90ms',
    transitionTimingFunction: 'ease-out',
    cursor: x.isClickable ? 'pointer' : 'default',
    stroke: x.stroke ? '#000' : 'transparent',
    strokeWidth: x.isSelected ? 3 : 0,
    pointerEvents: 'all',
    '&:hover': {
      transitionDuration: '0ms',
      fill: x.fill ?? 'none',
      stroke: x.stroke ?? '#fff',
      strokeWidth: x.strokeWidth ?? 3,
    },
  })
);
