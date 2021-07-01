import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Bounds, SeriesDoubleValue, SeriesItem } from '../logic';
import { StackedAreaTrend } from './stacked-area-trend';

type GappedStackedAreaTrendProps = {
  series: SeriesDoubleValue[];
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  bounds: Bounds;
  getX: (v: SeriesItem) => number;
  getY0: (v: SeriesDoubleValue) => number;
  getY1: (v: SeriesDoubleValue) => number;
  id: string;
};

export function GappedStackedAreaTrend(props: GappedStackedAreaTrendProps) {
  const {
    series,
    getX,
    getY0,
    getY1,
    bounds,
    color,
    fillOpacity,
    strokeWidth = 2,
    id,
  } = props;

  /**
   * Here we loop through the series and each time a null value is encountered a
   * new SeriesSingleValue array is created. Effectively creating separate lines
   * for each consecutive list of defined values.
   */
  const gappedSeries = useMemo(
    () =>
      series.reduce<SeriesDoubleValue[][]>(
        (lists, item) => {
          let currentList = last(lists) || [];
          if (currentList.length && !isDefined(item.__value_a)) {
            const newList: SeriesDoubleValue[] = [];
            lists.push(newList);
            currentList = newList;
          }
          if (isDefined(item.__value_a)) {
            currentList.push(item);
          }
          return lists;
        },
        [[]]
      ),
    [series]
  );

  return (
    <>
      {gappedSeries.map((series, index) => (
        <StackedAreaTrend
          key={index}
          series={series}
          color={color}
          strokeWidth={strokeWidth}
          getX={getX}
          getY0={getY0}
          getY1={getY1}
          bounds={bounds}
          fillOpacity={fillOpacity}
          id={`${id}_${index}`}
        />
      ))}
    </>
  );
}
