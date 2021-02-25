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
import { Bar } from '@visx/shape';
import React from 'react';
import { Padding } from '../logic';

interface ChartContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  onHover: (
    event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>
  ) => void;
  valueAnnotation?: string;
  padding: Padding;
  ariaLabelledBy: string;
}

export function ChartContainer({
  width,
  height,
  padding,
  ariaLabelledBy,
  onHover,
  children,
}: ChartContainerProps) {
  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-labelledby={ariaLabelledBy}
    >
      <Group left={padding.left} top={padding.top}>
        {/**
         * The Bar captures all mouse movements outside of trend elements. The Trend components * are rendered op top (in DOM) so that they can have their own hover state and
         * handlers. Trend hover handlers also have the advantage that we don't need to
         * do nearest point calculation on that event, because we already know the trend
         * index in the handler.
         */}
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onTouchStart={onHover}
          onTouchMove={onHover}
          onMouseMove={onHover}
          onMouseLeave={onHover}
        />

        {children}
      </Group>
    </svg>
  );
}
