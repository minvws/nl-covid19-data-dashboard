/**
 * The ChartContainer replaces combines most top-level components with some of
 * what used to be part of ChartAxes. The axes themselves have instead been
 * moved to the component root via children composition, to avoid prop drilling and keep things open.
 */
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import React from 'react';
import { Box } from '~/components-styled/base';
import { ChartPadding } from '~/components-styled/line-chart/components';
import { ValueAnnotation } from '~/components-styled/value-annotation';

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
  valueAnnotation,
  onHover,
  children,
}: ChartContainerProps) {
  return (
    <Box>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

      <Box position="relative">
        <svg
          width={width}
          height={height}
          role="img"
          aria-labelledby={ariaLabelledBy}
        >
          <Group left={padding.left} top={padding.top}>
            {children}

            {/**
             * Render the bar on top of the trends because it captures mouse hover when you are above the trend line
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
          </Group>
        </svg>
      </Box>
    </Box>
  );
}
