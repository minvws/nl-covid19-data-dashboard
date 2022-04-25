import { AreaClosed, LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import React from 'react';
import { useUniqueId } from '~/utils/use-unique-id';
import {
  curves,
  SeriesItem,
  SeriesSingleValue,
  SeriesMissingValue,
  isSeriesMissingValue,
} from '../logic';
import { useGappedSeries } from '../logic/use-gapped-series';

const DEFAULT_FILL_OPACITY = 0.2;
const DEFAULT_STROKE_WIDTH = 2;

type T = SeriesSingleValue | SeriesMissingValue;

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
  isMissing: boolean;
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
  isMissing = false,
}: GappedAreaTrendProps) {
  const gappedSeriesMissing: T[][] = useGappedSeries(
    series,
    isMissing /*isMissing data (For example: the weekends and holidays)*/
  );

  return (
    <>
      {gappedSeriesMissing.map((gappedSeries: T[], index) => (
        <React.Fragment key={index}>
          {isSeriesMissingValue(gappedSeries[0]) &&
          gappedSeries[0].__hasMissing ? (
            <LinePath
              data={[gappedSeries[0], gappedSeries[gappedSeries.length - 1]]}
              x={getX}
              y={getY}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5,5"
              curve={curves[curve]}
            />
          ) : (
            <LinePath
              data={gappedSeries}
              x={getX}
              y={getY}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              curve={curves[curve]}
            />
          )}
        </React.Fragment>
      ))}
      {gappedSeriesMissing.map((gappedSeries, index) => (
        <React.Fragment key={index}>
          {isSeriesMissingValue(gappedSeries[0]) &&
          gappedSeries[0].__hasMissing ? (
            <AreaClosed
              data={gappedSeries}
              x={getX}
              y={getY}
              fillOpacity={0}
              curve={curves[curve]}
              yScale={yScale}
              id={`${id}_${index}`}
            />
          ) : (
            <AreaClosed
              data={gappedSeries}
              x={getX}
              y={getY}
              fill={color}
              fillOpacity={fillOpacity}
              curve={curves[curve]}
              yScale={yScale}
              id={`${id}_${index}`}
            />
          )}
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
