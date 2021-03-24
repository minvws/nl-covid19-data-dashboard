import { Bar } from '@visx/shape';
import { colors } from '~/style/theme';
import { GetX } from '../logic';

const DEFAULT_FILL_OPACITY = 0.2;

export function TimespanAnnotation({
  start,
  end,
  domain,
  getX,
  height,
  color = colors.data.underReported,
  fillOpacity = DEFAULT_FILL_OPACITY,
}: {
  start: number;
  end: number;
  domain: [number, number];
  height: number;
  getX: GetX;
  color: string;
  fillOpacity?: number;
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
      fill={color}
      opacity={fillOpacity}
    />
  );
}

interface TimespanAnnotationIconProps {
  color: string;
  fillOpacity?: number;
  width?: number;
  height?: number;
}

export function TimespanAnnotationIcon({
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  width = 15,
  height = 15,
}: TimespanAnnotationIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={color}
        opacity={fillOpacity}
        rx={2}
      />
    </svg>
  );
}
