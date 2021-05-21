import { ClipPath } from '@visx/clip-path';
import { LinePath } from '@visx/shape';
import { PositionScale } from '@visx/shape/lib/types';
import { first, last } from 'lodash';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Bounds, SeriesItem, SeriesSingleValue, SplitPoint } from '../logic';
import { ColorStack } from './color-stack';
import { GradientPurpleOrange } from '@visx/gradient';

export type LineStyle = 'solid' | 'dashed';

const DEFAULT_STROKE_WIDTH = 2;

type SplitAreaTrendProps = {
  id: string;
  series: SeriesSingleValue[];
  splitPoints: SplitPoint[];
  strokeWidth?: number;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  bounds: Bounds;
  yScale: PositionScale;
};

type Point = { x: number; y: number };

export function SplitAreaTrend({
  series,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  splitPoints,
  getX,
  getY,
  bounds,
  yScale,
  id,
}: SplitAreaTrendProps) {
  // const segments = splitSeriesIntoSegments(series, splitPoints);

  const nonNullSeries = useMemo(
    () => series.filter((x) => isPresent(x.__value)),
    [series]
  );

  const trendPath = nonNullSeries.map((value) => ({
    x: getX(value),
    y: getY(value),
  }));

  const closedTrendPath = closeTrendPathAlongAxis(trendPath, bounds);

  const clippingId = `${id}_clipping`;
  const gradientId = `${id}_gradient`;

  return (
    <g>
      <ColorStack
        id={clippingId}
        splitPoints={splitPoints}
        bounds={bounds}
        yScale={yScale}
      />

      <ClipPath id={clippingId}>
        <LinePath
          data={closedTrendPath}
          x={(v) => v.x}
          y={(v) => v.y}
          stroke={splitPoints[0].color}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </ClipPath>
      {/*https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient */}
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="5%" stop-color="gold" />
          <stop offset="95%" stop-color="red" />
        </linearGradient>
      </defs>

      <GradientPurpleOrange id={gradientId} />

      <LinePath
        data={nonNullSeries}
        x={getX}
        y={getY}
        fill="transparent"
        // stroke="url(#stroke)"
        strokeWidth={3}
        // stroke={'#ccc'}
        stroke={`url(#${gradientId})`}
        // strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="round"
      />

      {/*
        Split line path currently has a bug
        https://github.com/airbnb/visx/issues/920

      <SplitLinePath
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

function closeTrendPathAlongAxis(path: Point[], bounds: Bounds): Point[] {
  const firstPoint = first(path) as Point;
  const lastPoint = last(path) as Point;

  return [
    ...path,
    { x: lastPoint.x, y: bounds.height },
    { x: firstPoint.x, y: bounds.height },
  ];
}
