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
   * This ref can be used for measuring the width of the benchmark-text to
   * automagically calculate a left-padding.
   */
  textRef?: Ref<SVGGElement>;

  /**
   * The xRangePadding can be used to add padding to the line. Note that this
   * will only widen the line and make it break outside of its bounds.
   */
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
    <Group top={top} left={-xRangePadding}>
      <g ref={textRef}>
        <text fontSize="14px" dy={-4} fill={color}>
          {label ? `${label}: ${value}` : value}
        </text>
      </g>
      <Line
        stroke={color}
        strokeDasharray="4,3"
        from={{ x: 0, y: 0 }}
        to={{
          /**
           * add twice the padding for left- and right-padding
           */
          x: width + xRangePadding + xRangePadding,
          y: 0,
        }}
      />
    </Group>
  );
}
