import { last } from 'lodash';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import {
  isSeriesSingleValue,
  isSeriesMissingValue,
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

      const getMissingDaysList = (startDate: number, endDate:number) => {
        const missingDaysList: SeriesMissingValue[] = [];
        const inBetweenSeconds = endDate - startDate - oneDay;
        const missingDaysCount = Math.round(inBetweenSeconds / oneDay)
        for (let i = 1; i <= missingDaysCount; i++) {
          const nextDate = startDate + (oneDay * i);
          const newList = {__date_unix: nextDate, __hasMissing: true};
          missingDaysList.push(newList);
        }
        return missingDaysList;
      }

      return series.reduce<T[][]>(
        (lists, item) => {
          const hasItemValue = isPresent(
            isSeriesSingleValue(item) ? item.__value : isSeriesMissingValue(item) ? item.__hasMissing : item.__value_a
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
            lists.push(getMissingDaysList(isLongerThanADay.__date_unix, item.__date_unix))
            const newList: T[] = [item];
            lists.push(newList);
            currentList = newList;
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
