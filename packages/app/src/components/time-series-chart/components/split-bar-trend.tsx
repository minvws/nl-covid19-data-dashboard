import { scaleBand } from '@visx/scale';
import { PositionScale } from '@visx/shape/lib/types';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useUniqueId } from '~/utils/use-unique-id';
import { Bounds, GetX, GetY, SeriesSingleValue } from '../logic';
import { SplitPoint } from '../logic/split';
import { SplitPointGradient } from './split-point-gradient';

const DEFAULT_FILL_OPACITY = 0.2;

type BarTrendProps = {
  series: SeriesSingleValue[];
  splitPoints: SplitPoint[];
  getX: GetX;
  getY: GetY;
  yScale: PositionScale;
  bounds: Bounds;
  fillOpacity?: number;
  bandPadding?: number;
};

export function SplitBarTrend({
  series,
  fillOpacity = DEFAULT_FILL_OPACITY,
  splitPoints,
  getX,
  getY,
  bounds,
  bandPadding = 0.2,
  yScale,
}: BarTrendProps) {
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

  const gradientId = useUniqueId();

  return (
    <>
      <SplitPointGradient
        id={gradientId}
        yScale={yScale}
        splitPoints={splitPoints}
      />

      {nonNullSeries.map((item, index) => (
        <rect
          key={index}
          x={getX(item) - barWidth / 2}
          y={getY(item)}
          height={bounds.height - getY(item)}
          width={barWidth}
          fill={`url(#${gradientId})`}
          opacity={fillOpacity}
        />
      ))}
    </>
  );
}
