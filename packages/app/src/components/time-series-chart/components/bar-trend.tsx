import { scaleBand } from '@visx/scale';
import { transparentize } from 'polished';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useUniqueId } from '~/utils/use-unique-id';
import { Bounds, GetX, GetY, SeriesSingleValue } from '../logic';

const DEFAULT_FILL_OPACITY = 0.2;

type BarTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  fillOpacity?: number;
  getX: GetX;
  getY: GetY;
  bounds: Bounds;
  bandPadding?: number;
  id: string;
};

export function BarTrend({
  series,
  fillOpacity = DEFAULT_FILL_OPACITY,
  color,
  getX,
  getY,
  bounds,
  bandPadding = 0.2,
  id,
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
  const zeroPosition = getY({ __value: 0, __date_unix: 0 });

  return (
    <>
      {nonNullSeries.map((item, index) => {
        const x = getX(item) - barWidth / 2;
        const y = Math.min(zeroPosition, getY(item));
        const barHeight = Math.abs(zeroPosition - getY(item));

        return (
          <rect
            key={index}
            x={x}
            y={y}
            height={barHeight}
            width={barWidth}
            fill={transparentize(1 - fillOpacity, color)}
            id={id}
          />
        );
      })}
    </>
  );
}

interface BarTrendIconProps {
  color: string;
  fillOpacity?: number;
  width?: number;
  height?: number;
}

export function BarTrendIcon({
  color,
  fillOpacity = DEFAULT_FILL_OPACITY,
  width = 15,
  height = 15,
}: BarTrendIconProps) {
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
      </g>
    </svg>
  );
}
