import { HoveredPoint } from '../logic';
import { TimestampedValue } from '@corona-dashboard/common';
import { Bounds } from '~/components-styled/time-series-chart/logic';
import styled from 'styled-components';
import { Bar } from '@visx/shape';

type BarHoverProps<T extends TimestampedValue> = {
  point: HoveredPoint<T>;
  bounds: Bounds;
  barWidth: number;
};

export function BarHover<T extends TimestampedValue>({
  point,
  bounds,
  barWidth,
}: BarHoverProps<T>) {
  return (
    <Bar
      fill={'rgba(0, 0, 0, 0.03)'}
      x={point.x}
      y={0}
      width={barWidth}
      height={bounds.height}
      transform={`translate(-${barWidth / 2}, 0)`}
    />
  );
}
