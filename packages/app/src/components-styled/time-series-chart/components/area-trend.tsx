import { AreaClosed, LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useUniqueId } from '~/utils/use-unique-id';
import { SeriesItem, SeriesSingleValue } from '../logic';

const DEFAULT_FILL_OPACITY = 0.2;
const DEFAULT_STROKE_WIDTH = 2;

type AreaTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'striped';
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  yScale: PositionScale;
};

export function AreaTrend({
  series,
  fillOpacity = DEFAULT_FILL_OPACITY,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  color,
  getX,
  getY,
  yScale,
}: AreaTrendProps) {
  const nonNullSeries = useMemo(
    () => series.filter((x) => isPresent(x.__value)),
    [series]
  );

  return (
    <>
      <LinePath
        data={nonNullSeries}
        x={getX}
        y={getY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <AreaClosed
        data={nonNullSeries}
        x={getX}
        y={getY}
        fill={color}
        fillOpacity={fillOpacity}
        yScale={yScale}
      />
    </>
  );
}

interface AreaTrendIconProps {
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

export function AreaTrendIcon({
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  width = 15,
  height = 15,
}: AreaTrendIconProps) {
  const maskId = useUniqueId();

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <mask id={maskId}>
        <rect rx={2} x={0} y={0} width={width} height={height} fill={'white'} />
      </mask>
      <g mask={`url(#${maskId})`}>
        <line
          stroke={color}
          strokeWidth={strokeWidth}
          x1={0}
          y1={strokeWidth / 2}
          x2={width}
          y2={strokeWidth / 2}
        />
        <rect
          rx={2}
          x={0}
          y={0}
          width={width}
          height={height}
          fill={color}
          opacity={fillOpacity}
        />
      </g>
    </svg>
  );
}
