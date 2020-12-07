import { useCallback, memo } from 'react';
import { Group } from '@visx/group';
// import { curveBasis } from '@visx/curve';
import { AreaClosed, Bar } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';

import { scaleLinear, scaleTime } from 'd3-scale';

const defaultMargin = { top: 40, right: 30, bottom: 30, left: 30 };

export type ThresholdProps = {
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
  height = 200,
  margin = defaultMargin,
  xDomain,
  yDomain,
  handleHover,
}: ThresholdProps) {
  const bounded = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const x = scaleTime().domain(xDomain).range([0, bounded.width]);
  const y = scaleLinear()
    .domain(yDomain)
    .range([bounded.height, 0])
    .nice(width > 520 ? 8 : 3);

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
        <AxisBottom
          top={bounded.height}
          scale={x}
          numTicks={width > 520 ? 10 : 5} // improve?
        />
        <AxisLeft scale={y} numTicks={5} />

        <AreaClosed
          data={trend}
          x={(d) => x(d.date)}
          y={(d) => y(getValue(d))}
          stroke="black"
          fill="pink"
          yScale={y}
          strokeWidth={1}
          // stroke="url(#area-gradient)"
          // fill="url(#area-gradient)"
          // curve={curveMonotoneX}
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
