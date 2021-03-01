import { Threshold } from '@visx/threshold';
import { useUniqueId } from '~/utils/useUniqueId';
import { SeriesDoubleValue, SeriesItem } from '../logic';

export type RangeTrendProps = {
  series: SeriesDoubleValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  style?: 'solid' | 'hatched';
  getX: (v: SeriesItem) => number;
  getY0: (v: SeriesDoubleValue) => number;
  getY1: (v: SeriesDoubleValue) => number;
};

export function RangeTrend({ series, getX, getY0, getY1 }: RangeTrendProps) {
  const id = useUniqueId();

  return (
    /**
     * @TODO further implement styling
     */
    <Threshold<SeriesDoubleValue>
      id={id}
      data={series}
      x={getX}
      y0={getY0}
      y1={getY1}
      clipBelowTo={getY0}
      clipAboveTo={getY1}
    />
  );
}
