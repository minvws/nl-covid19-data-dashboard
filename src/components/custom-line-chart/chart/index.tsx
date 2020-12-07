import { useCallback, memo } from 'react';
import { Group } from '@visx/group';
import { AreaClosed, LinePath, Bar } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { colors } from '~/style/theme';
import { GridRows } from '@visx/grid';

import { scaleLinear, scaleTime } from 'd3-scale';

const defaultMargin = { top: 10, right: 10, bottom: 30, left: 30 };
const defaultColors = {
  main: colors.data.primary,
  axis: '#C4C4C4',
};

export type ThresholdProps = {
  isHovered: boolean;
  trend: any[];
  getValue: any;
  handleHover: any;
  xDomain: any[];
  yDomain: any[];
  width: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

function Chart({
  trend,
  getValue,
  width,
  height = 250,
  margin = defaultMargin,
  xDomain,
  yDomain,
  handleHover,
  isHovered,
}: ThresholdProps) {
  const bounded = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const x = scaleTime().domain(xDomain).range([0, bounded.width]);
  const y = scaleLinear().domain(yDomain).range([bounded.height, 0]).nice();

  const bisect = useCallback(
    (trend, mx) => {
      const bisect = bisector((d) => d.date).left;
      const date = x.invert(mx - margin.left);
      const index = bisect(trend, date, 1);
      const d0 = trend[index - 1];
      const d1 = trend[index];

      return date - d0.date > d1.date - date ? d1 : d0;
    },
    [x, margin]
  );

  const onPointerMove = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      if (event.type === 'mouseleave') {
        handleHover(event);
      } else {
        const { x } = localPoint(event) || { x: 0 };
        const pointData = bisect(trend, x);

        handleHover(event, pointData, x, y(getValue(pointData)));
      }
    },
    [handleHover, y, trend, getValue, bisect]
  );

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <GridRows
          scale={y}
          width={bounded.width}
          numTicks={4}
          stroke={defaultColors.axis}
        />
        <AxisBottom
          top={bounded.height}
          scale={x}
          numTicks={width > 520 ? 10 : 5} // improve?
          stroke={defaultColors.axis}
        />
        <AxisLeft
          scale={y}
          numTicks={4}
          hideTicks
          hideAxisLine
          stroke={defaultColors.axis}
        />

        <AreaClosed
          data={trend}
          x={(d) => x(d.date)}
          y={(d) => y(getValue(d))}
          fill={defaultColors.main}
          fillOpacity={0.1}
          yScale={y}
        />
        <LinePath
          data={trend}
          x={(d) => x(d.date)}
          y={(d) => y(getValue(d))}
          stroke={defaultColors.main}
          strokeWidth={isHovered ? 3 : 2}
        />

        <Bar
          x={0}
          y={0}
          width={bounded.width}
          height={bounded.height}
          fill="transparent"
          rx={14}
          onTouchStart={onPointerMove}
          onTouchMove={onPointerMove}
          onMouseMove={onPointerMove}
          onMouseLeave={onPointerMove}
        />
      </Group>
    </svg>
  );
}

export default memo(Chart);
