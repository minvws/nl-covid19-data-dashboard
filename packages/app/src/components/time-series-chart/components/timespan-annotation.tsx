import { Bar } from '@visx/shape';
import { colors } from '~/style/theme';
import { GetX, TimespanAnnotationConfig } from '../logic';

const DEFAULT_COLOR = colors.data.underReported;

export function TimespanAnnotation({
  domain,
  getX,
  height,
  chartId,
  config,
}: {
  domain: [number, number];
  height: number;
  getX: GetX;
  chartId: string;
  config: TimespanAnnotationConfig;
}) {
  const [min, max] = domain;
  const { start, end } = config;

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

  switch (config.type) {
    case 'solid':
      return (
        <Bar
          pointerEvents="none"
          height={height}
          x={x0}
          width={width}
          fill={colors.data.underReported}
          opacity={1}
          style={{ mixBlendMode: 'multiply' }}
        />
      );
    case 'hatched':
      return (
        <Bar
          pointerEvents="none"
          height={height}
          x={x0}
          width={width}
          fill={`url(#${chartId}_hatched_pattern)`}
        />
      );
  }
}

interface SolidTimespanAnnotationIconProps {
  fillOpacity?: number;
  width?: number;
  height?: number;
}

export function SolidTimespanAnnotationIcon({
  width = 15,
  height = 15,
}: SolidTimespanAnnotationIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={DEFAULT_COLOR}
        opacity={1}
        rx={2}
        style={{ mixBlendMode: 'multiply' }}
      />
    </svg>
  );
}

type HatchedTimespanAnnotationIconProps = {
  width: number;
  height: number;
};

export function HatchedTimespanAnnotationIcon({
  width = 15,
  height = 15,
}: HatchedTimespanAnnotationIconProps) {
  return (
    <svg height={width} width={height}>
      <defs>
        <pattern
          id="hatch"
          width="4"
          height="4"
          patternTransform="rotate(-45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="5"
            style={{ stroke: 'gray', strokeWidth: 3 }}
          />
        </pattern>
      </defs>
      <rect height="15" width="15" fill="white" />
      <rect height="15" width="15" fill="url(#hatch)" />
    </svg>
  );
}
