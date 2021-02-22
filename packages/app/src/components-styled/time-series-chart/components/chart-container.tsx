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
import { ChartPadding } from '~/components-styled/line-chart/components';

interface ChartContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  onHover: (
    event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>
  ) => void;
  valueAnnotation?: string;
  padding: ChartPadding;
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
         * This bar captures all mouse movements outside of trend elements. Render it below the children (in the DOM) so that the children can have their own hover handlers.
         *
         * @TODO figure out if we can use the onHover state of different trends to avoid bisect and nearest point calculations.
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
