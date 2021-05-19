import { LinePath, SplitLinePath } from '@visx/shape';
import { SeriesItem, SeriesSingleValue, SplitPoint } from '../logic';

export type LineStyle = 'solid' | 'dashed';

const DEFAULT_STROKE_WIDTH = 2;

type SplitAreaTrendProps = {
  series: SeriesSingleValue[];
  splitPoints: SplitPoint[];
  strokeWidth?: number;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
};

type Point = { x: number; y: number };

export function SplitAreaTrend({
  series,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  splitPoints: __,
  getX,
  getY,
}: SplitAreaTrendProps) {
  // const nonNullSeries = useMemo(
  //   () => series.filter((x) => isPresent(x.__value)),
  //   [series]
  // );
  // console.log

  const lineSegments = [series];

  return (
    // <LinePath
    //   data={nonNullSeries}
    //   x={getX}
    //   y={getY}
    //   stroke={color}
    //   strokeWidth={strokeWidth}
    //   strokeLinecap="butt"
    //   strokeLinejoin="round"
    // />

    <SplitLinePath
      segments={lineSegments}
      x={getX}
      y={getY}
      styles={lineSegments.map((x) => ({ stroke: x.color }))}
    >
      {({ segment, styles }) => (
        <LinePath
          data={segment}
          /* x={getX} y={getY} */ {...styles}
          x={(d: Point) => d.x || 0}
          y={(d: Point) => d.y || 0}
          strokeLinecap="butt"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      )}
    </SplitLinePath>
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
