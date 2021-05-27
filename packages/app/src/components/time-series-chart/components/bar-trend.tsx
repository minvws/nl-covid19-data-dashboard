import { scaleBand } from '@visx/scale';
import { transparentize } from 'polished';
import { Fragment, useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useUniqueId } from '~/utils/use-unique-id';
import {
  BenchmarkConfig,
  Bounds,
  GetX,
  GetY,
  SeriesSingleValue,
} from '../logic';

const DEFAULT_FILL_OPACITY = 0.2;

type BarTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  fillOpacity?: number;
  getX: GetX;
  getY: GetY;
  bounds: Bounds;
  bandPadding?: number;
  benchmark?: BenchmarkConfig;
  aboveBenchmarkColor?: string;
  aboveBenchmarkFillOpacity?: number;
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
  benchmark,
  aboveBenchmarkColor,
  aboveBenchmarkFillOpacity = DEFAULT_FILL_OPACITY,
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

  const benchmarkY =
    benchmark &&
    getY({
      __value: benchmark.value,
      __date_unix: 0, // __date_unix is not used by getY
    });

  return (
    <>
      {nonNullSeries.map((item, index) => {
        const barHeight = bounds.height - getY(item);

        if (benchmarkY && aboveBenchmarkColor) {
          const benchmarkHeight = Math.max(0, benchmarkY - getY(item));

          return (
            <Fragment key={index}>
              <rect
                x={getX(item) - barWidth / 2}
                y={getY(item)}
                height={benchmarkHeight}
                width={barWidth}
                fill={transparentize(
                  1 - aboveBenchmarkFillOpacity,
                  aboveBenchmarkColor
                )}
              />
              <rect
                x={getX(item) - barWidth / 2}
                y={getY(item) + benchmarkHeight}
                height={barHeight - benchmarkHeight}
                width={barWidth}
                fill={transparentize(1 - fillOpacity, color)}
              />
            </Fragment>
          );
        }

        return (
          /**
           * We could use Visx shape Bar here, but it is almost the same as rect
           * and rect gives a bit more flexibility for example with regards to
           * hover state if we choose to implement that.
           */
          <rect
            key={index}
            x={getX(item) - barWidth / 2}
            y={getY(item)}
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
