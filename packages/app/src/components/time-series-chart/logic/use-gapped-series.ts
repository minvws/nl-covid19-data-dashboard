import { last } from 'lodash';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import {
  isSeriesSingleValue,
  SeriesDoubleValue,
  SeriesSingleValue,
} from './series';

/**
 * This hook takes an array of SeriesSingleValues or SeriesDoubleValues and splits
 * it up into multiple arrays whenever an item is encountered with null values.
 * So a new array is created for each consecutive list of valid items.
 */
export function useGappedSeries<
  T extends SeriesSingleValue | SeriesDoubleValue
>(series: T[]) {
  return useMemo(
    () =>
      series.reduce<T[][]>(
        (lists, item) => {
          const hasItemValue = isPresent(
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
