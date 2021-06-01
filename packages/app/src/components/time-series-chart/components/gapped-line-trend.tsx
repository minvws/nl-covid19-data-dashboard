import { last } from 'lodash';
import { isDefined } from 'ts-is-present';
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
      if (currentList.length && !isDefined(item.__value)) {
        list.push([]);
        currentList = last(list) || [];
      }
      if (isDefined(item.__value)) {
        currentList.push(item);
      }
      return list;
    },
    [[]]
  );

  console.dir(gappedSeries);

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
