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
  timespan: number;
};

export function GappedLinedTrend(props: GappedLinedTrendProps) {
  const { series, color, style, strokeWidth, getX, getY, curve, id, timespan } =
    props;

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

  const halfOfTimespan = timespan / 2;
  gappedSeries.forEach((item, index, array) => {
    if (item.length === 1 && timespan > 0) {
      array[index] = [
        {
          __value: item[0].__value,
          __date_unix: item[0].__date_unix - halfOfTimespan,
        },
        {
          __value: item[0].__value,
          __date_unix: item[0].__date_unix + halfOfTimespan,
        },
      ];
    }
  });

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
