import { colors } from '@corona-dashboard/common';
import { PatternLines } from '@visx/pattern';
import { scaleBand } from '@visx/scale';
import { PositionScale } from '@visx/shape/lib/types';
import { transparentize } from 'polished';
import React, { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useUniqueId } from '~/utils/use-unique-id';
import { Bounds, GetX, GetY0, GetY1, SeriesDoubleValue, SeriesSingleValue } from '../logic';
import { AreaTrend } from './area-trend';

const DEFAULT_FILL_OPACITY = 0.2;

type BarTrendProps = {
  series: SeriesDoubleValue[];
  color: string;
  fillOpacity?: number;
  getX: GetX;
  getY0: GetY0;
  getY1: GetY1;
  bounds: Bounds;
  bandPadding?: number;
  id: string;
  yScale: PositionScale;
  seriesMax?: number;
};

export function BarTrend({ series, fillOpacity = DEFAULT_FILL_OPACITY, color, getX, getY0, getY1, bounds, bandPadding = 0.2, id, yScale, seriesMax }: BarTrendProps) {
  const nonNullSeries = useMemo(() => series.filter((x) => isPresent(x.__value_a) && isPresent(x.__value_b)), [series]);

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
  const zeroPosition = getY1({ __value_a: 0, __value_b: 0, __date_unix: 0 });

  const outOfBoundsItems: SeriesSingleValue[] = [];
  const items: SeriesDoubleValue[] = [];
  nonNullSeries.forEach((x) => {
    const outOfBounds = undefined !== seriesMax && undefined !== x.__value_a && x.__value_a > seriesMax;
    outOfBounds ? outOfBoundsItems.push(x) : items.push(x);
  });

  return (
    <>
      {outOfBoundsItems.length && (
        <>
          {outOfBoundsItems.map((item, index) => {
            const value = { __value: seriesMax, __date_unix: item.__date_unix };
            const x = getX(item) - barWidth / 2;
            const y = Math.min(zeroPosition, getY0(value));
            const barHeight = Math.abs(zeroPosition - getY0(value));

            return (
              <React.Fragment key={`out-of-bounds-${index}`}>
                {/* magic-number-alert at the next line the component <PatternLines> receives a number as a height and width.
                Those are related to the visX library and connot be changed to string/pixel values */}
                <PatternLines id="diagonal-pattern" height={6} width={6} stroke={colors.neutral} strokeWidth={2} orientation={['diagonal']} />
                <rect key={index} x={x} y={y} height={barHeight} width={barWidth} fill={'url(#diagonal-pattern)'} id={id} />
              </React.Fragment>
            );
          })}
        </>
      )}

      {barWidth > 1 ? (
        <>
          {items.map((item, index) => {
            const x = getX(item) - barWidth / 2;
            const y = Math.min(zeroPosition, getY0(item));
            const barHeight = Math.abs(zeroPosition - getY0(item));

            return <rect key={index} x={x} y={y} height={barHeight} width={barWidth} fill={transparentize(1 - fillOpacity, color)} id={`${id}_${index}`} />;
          })}
        </>
      ) : (
        <>
          <AreaTrend
            series={series.filter((x) => undefined !== seriesMax && undefined !== x.__value_a && x.__value_a < seriesMax)}
            color={color}
            fillOpacity={fillOpacity}
            strokeWidth={0}
            curve="step"
            getX={getX}
            getY={getY0}
            yScale={yScale}
            id={id}
          />
        </>
      )}
    </>
  );
}

interface BarTrendIconProps {
  color: string;
  fillOpacity?: number;
  width?: number;
  height?: number;
}

export function BarTrendIcon({ color, fillOpacity = DEFAULT_FILL_OPACITY, width = 15, height = 15 }: BarTrendIconProps) {
  const maskId = useUniqueId();

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <mask id={maskId}>
        <rect rx={2} x={0} y={0} width={width} height={height} fill={'white'} />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect rx={2} x={0} y={0} width={width} height={height} fill={color} opacity={fillOpacity} />
      </g>
    </svg>
  );
}
