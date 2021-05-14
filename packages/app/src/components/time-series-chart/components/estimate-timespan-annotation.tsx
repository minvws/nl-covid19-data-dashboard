import { Bar } from '@visx/shape';
import { GetX } from '../logic';

export function EstimateTimespanAnnotation({
  start,
  end,
  domain,
  getX,
  height,
}: {
  start: number;
  end: number;
  domain: [number, number];
  height: number;
  getX: GetX;
}) {
  const [min, max] = domain;

  /**
   * Clip the start / end dates to the domain of the x-axis, so that we can
   * conveniently pass in things like Infinity for end date.
   */
  const clippedStart = Math.max(start, min);
  const clippedEnd = Math.min(end, max);

  const x0 = getX({ __date_unix: clippedStart });
  const x1 = getX({ __date_unix: clippedEnd });

  /**
   * Here we do not have to calculate where the dates fall on the x-axis because
   * the unix timestamps are used directly for the xScale.
   */
  const width = x1 - x0;

  if (width <= 0) return null;

  return (
    <Bar
      pointerEvents="none"
      height={height}
      x={x0}
      width={width}
      fill={'white'}
    />
  );
}
