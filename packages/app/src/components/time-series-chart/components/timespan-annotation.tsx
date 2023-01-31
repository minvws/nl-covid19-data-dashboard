import { colors } from '@corona-dashboard/common';
import { PatternLines } from '@visx/pattern';
import { Bar } from '@visx/shape';
import { useUniqueId } from '~/utils/use-unique-id';
import { GetX, TimespanAnnotationConfig, Bounds, SeriesSingleValue } from '../logic';

const DEFAULT_COLOR = colors.gray2;

export function TimespanAnnotation({
  domain,
  getX,
  height,
  config,
}: {
  domain: [number, number];
  height: number;
  getX: GetX;
  config: TimespanAnnotationConfig;
  bounds: Bounds;
  series: SeriesSingleValue[];
}) {
  const [min, max] = domain;
  const { start, end } = config;
  const fill = config.fill ?? 'solid';
  const id = useUniqueId();
  const patternId = `${id}_annotation_pattern`;

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
    <>
      {fill === 'hatched' && (
        <pattern id={patternId} width="8px" height="8px" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" style={{ stroke: 'white', strokeWidth: 4 }} />
        </pattern>
      )}
      {fill === 'dotted' && (
        <pattern id={patternId} width="4px" height="4px" patternUnits="userSpaceOnUse">
          <line x1="0" y1="4" x2="0" y2="0" style={{ stroke: 'white', strokeWidth: 4, strokeDasharray: 2 }} />
        </pattern>
      )}

      <Bar
        pointerEvents="none"
        height={height}
        x={x0}
        width={width}
        fill={fill === 'solid' ? colors.gray2 : `url(#${patternId})`}
        style={fill === 'solid' ? { mixBlendMode: 'multiply' } : undefined}
      />
    </>
  );
}

interface SolidTimespanAnnotationIconProps {
  fillOpacity?: number;
  width?: number;
  height?: number;
}

export function SolidTimespanAnnotationIcon({ width = 15, height = 15 }: SolidTimespanAnnotationIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x={0} y={0} width={width} height={height} fill={DEFAULT_COLOR} opacity={1} rx={2} style={{ mixBlendMode: 'multiply' }} />
    </svg>
  );
}

interface OutOfBoundsIconProps {
  width?: number;
  height?: number;
}

export function OutOfBoundsIcon({ width = 15, height = 15 }: OutOfBoundsIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <PatternLines id="diagonal-pattern" height={6} width={6} stroke={colors.neutral} strokeWidth={2} orientation={['diagonal']} />
      <rect rx={2} x={0} y={0} width={width} height={height} fill="url(#diagonal-pattern)" />
    </svg>
  );
}

type HatchedTimespanAnnotationIconProps = {
  width?: number;
  height?: number;
};

export function HatchedTimespanAnnotationIcon({ width = 15, height = 15 }: HatchedTimespanAnnotationIconProps) {
  return (
    <svg height={width} width={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <pattern id="hatch" width="4px" height="4px" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="5" style={{ stroke: colors.gray5, strokeWidth: 3 }} />
        </pattern>
      </defs>
      <rect height={height} width={width} fill="white" />
      <rect height={height} width={width} fill="url(#hatch)" />
    </svg>
  );
}
