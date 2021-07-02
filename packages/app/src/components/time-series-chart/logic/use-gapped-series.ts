import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import {
  isSeriesSingleValue,
  SeriesDoubleValue,
  SeriesSingleValue,
} from './series';

export function useGappedSeries<
  T extends SeriesSingleValue | SeriesDoubleValue
>(series: T[]) {
  return useMemo(
    () =>
      /**
       * Here we loop through the series and each time a null value is encountered a
       * new SeriesSingleValue array is created. Effectively creating separate lines
       * for each consecutive list of defined values.
       */
      series.reduce<T[][]>(
        (lists, item) => {
          const hasItemValue = isDefined(
            isSeriesSingleValue(item) ? item.__value : item.__value_a
          );

          let currentList = last(lists) ?? [];
          if (currentList.length && !hasItemValue) {
            const newList: T[] = [];
            lists.push(newList);
            currentList = newList;
          }
          if (hasItemValue) {
            currentList.push(item);
          }
          return lists;
        },
        [[]]
      ),
    [series]
  );
}
