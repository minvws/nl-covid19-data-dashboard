import { useCallback, memo } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { bisector } from 'd3-array';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { Text } from '@visx/text';

import { colors } from '~/style/theme';
import Trends from './trends';

const defaultMargin = { top: 10, right: 10, bottom: 30, left: 30 };
const defaultColors = {
  main: colors.data.primary,
  axis: '#C4C4C4',
};

export type Props = {
  benchmark: any;
  isHovered: boolean;
  trend: any[];
  handleHover: any;
  xDomain: any[];
  yDomain: any[];
  width: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

function Chart({
  trend,
  width,
  height = 250,
  margin = defaultMargin,
  xDomain,
  yDomain,
  handleHover,
  isHovered,
  benchmark,
}: Props) {
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
          numTicks={2} // TODO: fix
          stroke={defaultColors.axis}
        />
        <AxisLeft
          scale={y}
          numTicks={4}
          hideTicks
          hideAxisLine
          stroke={defaultColors.axis}
        />

        {benchmark && (
          <Group top={y(benchmark.value)}>
            <Text fontSize="14px" dy={-8}>
              {benchmark.value}
            </Text>
            <Text fontSize="14px" dy={-8} dx={bounded.width} textAnchor="end">
              {benchmark.label}
            </Text>
            <Line
              stroke="black"
              strokeDasharray="4,3"
              from={{ x: 0, y: 0 }}
              to={{ x: bounded.width, y: 0 }}
            />
          </Group>
        )}

        <Trends
          size={bounded}
          x={x}
          y={y}
          trend={trend}
          color={defaultColors.main}
          handleHover={handleHover}
          isHovered={isHovered}
          bisect={bisect}
        />
      </Group>
    </svg>
  );
}

export default memo(Chart);
