import { PositionScale } from '@visx/shape/lib/types';
import { first, last } from 'lodash';
import { Fragment } from 'react';
import { SplitPoint } from '../logic';

interface SplitPointGradientProps {
  id: string;
  splitPoints: SplitPoint[];
  yScale: PositionScale;
}

export function SplitPointGradient({
  id,
  splitPoints,
  yScale,
}: SplitPointGradientProps) {
  const domain = yScale.domain();
  const lowValue = first(domain) as number;
  const highValue = last(domain) as number;

  const stops = splitPoints.map((x) => ({
    offset:
      x.value === Infinity
        ? '100%'
        : ((x.value - lowValue) / (highValue - lowValue)) * 100 + '%',
    color: x.color,
  }));

  return (
    <linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      x1={0}
      y1={yScale(lowValue)}
      x2={0}
      y2={yScale(highValue)}
    >
      {stops.map((x, i, list) => (
        <Fragment key={i}>
          {list[i - 1] ? (
            <stop offset={list[i - 1].offset} stopColor={list[i].color} />
          ) : (
            <stop offset="0%" stopColor={list[i].color} />
          )}
          <stop offset={x.offset} stopColor={x.color} />
        </Fragment>
      ))}
    </linearGradient>
  );
}
