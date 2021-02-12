import { TimestampedValue } from '@corona-dashboard/common';
import { Point } from '@visx/point';
import { HoverPoint } from '~/components-styled/line-chart/components';

export function calculateDistance(
  point1: HoverPoint<TimestampedValue>,
  point2: Point
) {
  const x = point2.x - point1.x;
  const y = point2.y - point1.y;
  return Math.sqrt(x * x + y * y);
}
