/**
 * The ChartContainer replaces combines most top-level components with some of
 * what used to be part of ChartAxes. The axes themselves have instead been
 * moved to the component root via children composition, to avoid prop drilling
 * and keep things open.
 *
 * The children of this component are rendered as part of an svg, so do not
 * attempt to render normal DOM components like the Markers or Tooltip
 * components as part of its children.
 */
import { Group } from '@visx/group';
import React from 'react';
import { Padding } from '../logic';

interface ChartContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  padding: Padding;
  valueAnnotation?: string;
  ariaLabelledBy: string;
  onHover: (event: Event) => void;
  onClick: (event: Event) => void;
}

type Event = React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>;

export function ChartContainer({
  width,
  height,
  padding,
  ariaLabelledBy,
  children,
  onHover,
  onClick,
}: ChartContainerProps) {
  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-labelledby={ariaLabelledBy}
      style={{ touchAction: 'pan-y' }}
      onTouchStart={onHover}
      onTouchMove={onHover}
      onMouseMove={onHover}
      onMouseLeave={onHover}
      onClick={onClick}
    >
      <Group left={padding.left} top={padding.top}>
        {children}
      </Group>
    </svg>
  );
}
