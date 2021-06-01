import { last } from 'lodash';
import { SeriesItem, SeriesSingleValue } from '../logic';
import { LineTrend } from './line-trend';

type GappedLinedTrendProps = {
  series: SeriesSingleValue[];
  color: string;
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
  getX: (v: SeriesItem) => number;
  getY: (v: SeriesSingleValue) => number;
  curve?: 'linear' | 'step';
  id: string;
};

export function GappedLinedTrend(props: GappedLinedTrendProps) {
  const { series, color, style, strokeWidth, getX, getY, curve, id } = props;
  const gappedSeries = series.reduce<SeriesSingleValue[][]>(
    (list, item) => {
      let currentList = last(list) || [];
      if (currentList.length && item.__value === null) {
        list.push([]);
        currentList = last(list) || [];
      }
      if (item.__value !== null) {
        currentList.push(item);
      }
      return list;
    },
    [[]]
  );

  return (
    <>
      {gappedSeries.map((series, index) => (
        <LineTrend
          key={index}
          series={series}
          color={color}
          style={style}
          strokeWidth={strokeWidth}
          curve={curve}
          getX={getX}
          getY={getY}
          id={id}
        />
      ))}
    </>
  );
}
