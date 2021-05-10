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
import css from '@styled-system/css';
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
  onHover?: (event: Event) => void;
  onClick?: (event: Event) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
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
  onFocus,
  onBlur,
}: ChartContainerProps) {
  return (
    <svg
      width={width}
      /**
       * When, for example, a horizontal line with a 1px size is drawn on a Y-
       * value of 2, the line itself will be rendered _exactly_ on coordinate
       * (0,2). Due to the 1px size of that line, it will visually be drawn from
       * (0,1.5) to (0,2.5), with the center of the line still on (0,2).
       * Those half pixel values can result in blurry lines on some browsers or
       * monitors.
       *
       * In order to fix the above the viewbox is moved for half a pixel.
       *
       * inspired by: https://vecta.io/blog/guide-to-getting-sharp-and-crisp-svg-images
       */
      viewBox={`-0.5 -0.5 ${width} ${height}`}
      role="img"
      aria-labelledby={ariaLabelledBy}
      css={css({
        touchAction: 'pan-y',
        userSelect: 'none',
        width: '100%',
        overflow: 'visible',
      })}
      onTouchStart={onHover}
      onTouchMove={onHover}
      onMouseMove={onHover}
      onMouseLeave={onHover}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      tabIndex={onFocus ? 0 : -1}
    >
      <Group left={padding.left} top={padding.top}>
        {children}
      </Group>
    </svg>
  );
}
