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

  /**
   * Here we loop through the series and each time a null value is encountered a
   * new SeriesSingleValue array is created. Effectively creating separate lines
   * for each consecutive list of defined values.
   */
  const gappedSeries = series.reduce<SeriesSingleValue[][]>(
    (lists, item) => {
      let currentList = last(lists) || [];
      if (currentList.length && !isDefined(item.__value)) {
        const newList: SeriesSingleValue[] = [];
        lists.push(newList);
        currentList = newList;
      }
      if (isDefined(item.__value)) {
        currentList.push(item);
      }
      return lists;
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
