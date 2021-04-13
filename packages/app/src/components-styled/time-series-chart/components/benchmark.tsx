import { colors } from '~/style/theme';
import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { Ref } from 'react';

interface BenchmarkProps {
  value: number;
  label?: string;
  top: number;
  width: number;
  /**
   * This ref can be used for measuring the width of the Y-axis to automagically
   * calculate a left-padding.
   */
  textRef?: Ref<SVGGElement>;

  xRangePadding?: number;
}

const color = colors.data.benchmark;

export function Benchmark({
  top,
  value,
  label,
  width,
  textRef,
  xRangePadding = 0,
}: BenchmarkProps) {
  return (
    <Group top={top}>
      <g ref={textRef}>
        <text fontSize="14px" dx={-xRangePadding} dy={-4} fill={color}>
          {label ? `${label}: ${value}` : value}
        </text>
      </g>
      <Line
        stroke={color}
        strokeDasharray="4,3"
        from={{ x: 0 - xRangePadding, y: 0 }}
        to={{ x: width + xRangePadding, y: 0 }}
      />
    </Group>
  );
}
