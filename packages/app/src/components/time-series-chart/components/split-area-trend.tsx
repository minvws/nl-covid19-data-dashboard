import { AreaClosed, LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useUniqueId } from '~/utils/use-unique-id';
import { SeriesItem, SeriesSingleValue, SplitPoint } from '../logic';
import { SplitPointGradient } from './split-point-gradient';

const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_FILL_OPACITY = 0.5;

type SplitAreaTrendProps = {
  series: SeriesSingleValue[];
  splitPoints: SplitPoint[];
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  yScale: PositionScale;
  strokeWidth?: number;
  fillOpacity?: number;
  id: string;
};

export function SplitAreaTrend({
  series,
  splitPoints,
  getX,
  getY,
  yScale,
  id,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  fillOpacity = DEFAULT_FILL_OPACITY,
}: SplitAreaTrendProps) {
  const nonNullSeries = useMemo(
    () => series.filter((x) => isPresent(x.__value)),
    [series]
  );

  const gradientId = useUniqueId();

  return (
    <g>
      <SplitPointGradient
        id={gradientId}
        splitPoints={splitPoints}
        yScale={yScale}
      />

      <LinePath
        data={nonNullSeries}
        x={getX}
        y={getY}
        fill="transparent"
        strokeWidth={strokeWidth}
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <AreaClosed
        id={id}
        data={nonNullSeries}
        x={getX}
        y={getY}
        fill={`url(#${gradientId})`}
        fillOpacity={fillOpacity}
        yScale={yScale}
      />
    </g>
  );
}

interface SplitAreaTrendIconProps {
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

export function SplitAreaTrendIcon({
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  width = 15,
  height = 15,
}: SplitAreaTrendIconProps) {
  const maskId = useUniqueId();

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <mask id={maskId}>
        <rect rx={2} x={0} y={0} width={width} height={height} fill={'white'} />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect
          rx={2}
          x={0}
          y={0}
          width={width}
          height={height}
          fill={color}
          opacity={fillOpacity}
        />
        <line
          stroke={color}
          strokeWidth={strokeWidth}
          x1={0}
          y1={strokeWidth / 2}
          x2={width}
          y2={strokeWidth / 2}
        />
      </g>
    </svg>
  );
}
