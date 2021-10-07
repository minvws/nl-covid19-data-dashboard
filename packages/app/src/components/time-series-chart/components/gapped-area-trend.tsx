import { AreaClosed, LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import React from 'react';
import { useUniqueId } from '~/utils/use-unique-id';
import { curves, SeriesItem, SeriesSingleValue } from '../logic';
import { useGappedSeries } from '../logic/use-gapped-series';

const DEFAULT_FILL_OPACITY = 0.2;
const DEFAULT_STROKE_WIDTH = 2;

type GappedAreaTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  yScale: PositionScale;
  curve?: 'linear' | 'step';
  id: string;
};

export function GappedAreaTrend({
  series,
  fillOpacity = DEFAULT_FILL_OPACITY,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  color,
  getX,
  getY,
  yScale,
  curve = 'linear',
  id,
}: GappedAreaTrendProps) {
  const gappedSeries = useGappedSeries(series);

  return (
    <>
      {gappedSeries.map((series, index) => (
        <React.Fragment key={index}>
          <LinePath
            data={series}
            x={getX}
            y={getY}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curves[curve]}
          />
          <AreaClosed
            data={series}
            x={getX}
            y={getY}
            fill={color}
            fillOpacity={fillOpacity}
            curve={curves[curve]}
            yScale={yScale}
            id={`${id}_${index}`}
          />
        </React.Fragment>
      ))}
    </>
  );
}

interface GappedAreaTrendIconProps {
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

export function GappedAreaTrendIcon({
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  width = 15,
  height = 15,
}: GappedAreaTrendIconProps) {
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
