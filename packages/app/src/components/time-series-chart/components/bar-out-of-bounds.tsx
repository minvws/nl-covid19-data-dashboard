import { colors } from '@corona-dashboard/common';
import { PatternLines } from '@visx/pattern';
import { scaleBand } from '@visx/scale';
import { PositionScale } from '@visx/shape/lib/types';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Bounds, GetX, SeriesSingleValue } from '../logic';

type BarOutOfBoundsProps = {
  series: SeriesSingleValue[];
  color: string;
  getX: GetX;
  bounds: Bounds;
  bandPadding?: number;
  id: string;
  yScale: PositionScale;
  outOfBoundsDates?: number[];
};

export function BarOutOfBounds({
  series,
  getX,
  bounds,
  bandPadding = 0.2,
  id,
  outOfBoundsDates,
}: BarOutOfBoundsProps) {
  const nonNullSeries = useMemo(
    () => series.filter((x) => isPresent(x.__value)),
    [series]
  );

  const xScale = useMemo(
    () =>
      scaleBand<number>({
        range: [0, bounds.width],
        round: true,
        domain: series.map(getX),
        padding: bandPadding,
      }),
    [bounds, getX, series, bandPadding]
  );

  /**
   * Clip bar width to minimum of 1px otherwise the shape disappears on
   * mobile screens.
   */
  const barWidth = Math.max(xScale.bandwidth(), 1);

  return (
    <>
      {nonNullSeries
        .filter((x) => outOfBoundsDates?.includes(x.__date_unix))
        .map((item) => {
          const x = getX(item) - barWidth / 2;
          const y = 1 / bounds.height;
          const barHeight = bounds.height;

          return (
            <>
              <rect
                x={x}
                y={y}
                height={barHeight}
                width={barWidth}
                fill="url(#diagonal-pattern)"
                id={id}
              />
              <PatternLines
                id="diagonal-pattern"
                height={6}
                width={6}
                stroke={colors.data.neutral}
                strokeWidth={2}
                orientation={['diagonal']}
              />
            </>
          );
        })}
    </>
  );
}

interface BarOutOfBoundsIconProps {
  width?: number;
  height?: number;
}

export function BarOutOfBoundsIcon({
  width = 15,
  height = 15,
}: BarOutOfBoundsIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <PatternLines
        id="diagonal-pattern"
        height={6}
        width={6}
        stroke={colors.data.neutral}
        strokeWidth={2}
        orientation={['diagonal']}
      />
      <rect
        rx={2}
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#diagonal-pattern)"
      />
    </svg>
  );
}
