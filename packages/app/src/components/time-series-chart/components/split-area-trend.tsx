import { ClipPath } from '@visx/clip-path';
import { LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Bounds, SeriesItem, SeriesSingleValue, SplitPoint } from '../logic';
import { ColorStack } from './color-stack';

export type LineStyle = 'solid' | 'dashed';

const DEFAULT_STROKE_WIDTH = 2;

type SplitAreaTrendProps = {
  series: SeriesSingleValue[];
  splitPoints: SplitPoint[];
  strokeWidth?: number;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  bounds: Bounds;
  yScale: PositionScale;
};

// type Point = { x: number; y: number };

export function SplitAreaTrend({
  series,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  splitPoints,
  getX,
  getY,
  bounds,
  yScale,
}: SplitAreaTrendProps) {
  // const segments = splitSeriesIntoSegments(series, splitPoints);

  const nonNullSeries = useMemo(
    () => series.filter((x) => isPresent(x.__value)),
    [series]
  );

  return (
    <g>
      <ColorStack splitPoints={splitPoints} bounds={bounds} yScale={yScale} />
      <LinePath
        data={nonNullSeries}
        x={getX}
        y={getY}
        stroke={splitPoints[0].color}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      <ClipPath id="todo_some_unique_id">
        <LinePath
          data={nonNullSeries}
          x={getX}
          y={getY}
          stroke={splitPoints[0].color}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </ClipPath>

      {/* <SplitLinePath
        segments={segments.map((x) => x.items)}
        x={getX}
        y={getY}
        styles={segments.map((x) => ({
          stroke: splitPoints[x.splitIndex].color,
        }))}
      >
        {({ segment, styles }) => (
          <LinePath
            data={segment}
            {...styles}
            x={(d: Point) => d.x || 0}
            y={(d: Point) => d.y || 0}
            strokeWidth={strokeWidth}
          />
        )}
      </SplitLinePath> */}
    </g>
  );
}

interface SplitAreaTrendIconProps {
  color: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

export function SplitAreaTrendIcon({
  color,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  width = 15,
  height = 15,
}: SplitAreaTrendIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <line
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        x1={2}
        y1={height / 2}
        x2={width - 2}
        y2={height / 2}
      />
    </svg>
  );
}
