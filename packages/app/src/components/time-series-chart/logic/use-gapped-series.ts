import { last } from 'lodash';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import {
  isSeriesSingleValue,
  SeriesDoubleValue,
  SeriesSingleValue,
  SeriesMissingValue,
} from './series';

/**
 * This hook takes an array of SeriesSingleValues or SeriesDoubleValues and splits
 * it up into multiple arrays whenever an item is encountered with null values.
 * So a new array is created for each consecutive list of valid items.
 */
export function useGappedSeries<
  T extends SeriesSingleValue | SeriesDoubleValue | SeriesMissingValue
>(series: T[], isMissing?: boolean) {
  
  return useMemo(
    () => {
      const DayTreshholdInSeconds = 130000;
      const oneDay = 86400;

      const getMissingDaysList = (startItem: SeriesSingleValue, endItem: SeriesSingleValue) => {
        const missingDaysList: T[] = [];
        const inBetweenSeconds = endItem.__date_unix - startItem.__date_unix - oneDay;
        const missingDaysCount = Math.round(inBetweenSeconds / oneDay)
        const firstDay = {__value: startItem.__value, __date_unix: startItem.__date_unix, __hasMissing: true} as SeriesMissingValue as T;
        missingDaysList.push(firstDay);
        for (let i = 1; i <= missingDaysCount; i++) {
          const nextDate = startItem.__date_unix + (oneDay * i);
          const newList = {__value: startItem.__value, __date_unix: nextDate, __hasMissing: true} as SeriesMissingValue as T;
          missingDaysList.push(newList);
        }
        const lastDay = {__value: endItem.__value, __date_unix: endItem.__date_unix, __hasMissing: true} as SeriesMissingValue as T;
        missingDaysList.push(lastDay);
        return missingDaysList;
      }

      return series.reduce<T[][]>(
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

          // Get the previous value or the current one.
          // The determain if days are skipped
          // The current threshold is 1,5 days to take count for irregularity in data
          const isLongerThanADay = last(currentList) ?? item;
          if ((item.__date_unix - isLongerThanADay.__date_unix) > DayTreshholdInSeconds && (isMissing ?? false)) {
            lists.push(getMissingDaysList(isLongerThanADay, item))
            const newList: T[] = [item];
            lists.push(newList);
            currentList = [...newList];
            currentList.push(item);
          } else {
            if (hasItemValue) {
              currentList.push(item);
            }
          }

          return lists;
        },
        [[]]
      )}, [series, isMissing]
  );
}
