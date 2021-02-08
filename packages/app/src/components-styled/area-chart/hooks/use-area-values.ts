import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import {
  getTimeframeValues,
  timestampToDate,
  TrendValue,
} from '~/components-styled/line-chart/logic';
import {
  isDateSeries,
  isDateSpanSeries,
  Value,
} from '~/components-styled/stacked-chart/logic';
import { TimeframeOption } from '~/utils/timeframe';
import { isArrayOfArrays } from '~/utils/typeguards/is-array-of-arrays';
import { AreaConfig } from '../area-chart-graph';

export function useAreaValues<T extends Value>(
  values: T[] | T[][],
  areaConfigs: AreaConfig<T>[] | AreaConfig<T>[][],
  timeframe: TimeframeOption
): (TrendValue & Value)[][] {
  const configList = isArrayOfArrays(areaConfigs) ? areaConfigs : [areaConfigs];
  const metricProperties = useMemo(
    () => configList.map((x) => x.map((x) => x.metricProperty)),
    [areaConfigs]
  );

  const valuesList = isArrayOfArrays(values) ? values : [values];

  const areaLists = useMemo(
    () =>
      valuesList.map((x, i) => getAreaData(x, metricProperties[i], timeframe)),
    [values, metricProperties, timeframe]
  );

  return areaLists;
}

export function getAreaData<T extends Value>(
  values: T[],
  metricProperties: (keyof T)[],
  timeframe: TimeframeOption
): (TrendValue & Value)[] {
  const valuesInFrame = getTimeframeValues(values, timeframe);

  if (valuesInFrame.length === 0) {
    /**
     * It could happen that you are using an old dataset and select last week as
     * a timeframe at which point the values will be empty. This would not
     * happen on production, but for development we can just render nothing.
     */
    return [];
  }

  const sum = (obj: any, propertyNames: (keyof T)[]) => {
    return propertyNames.reduce((total, name) => total + obj[name], 0);
  };

  if (isDateSeries(valuesInFrame)) {
    return valuesInFrame
      .map((x) => ({
        ...x,
        __value: sum(x, metricProperties),
        __date: timestampToDate(x.date_unix),
      }))
      .filter((x) => isPresent(x.__value));
  }

  if (isDateSpanSeries(valuesInFrame)) {
    return valuesInFrame
      .map((x) => ({
        ...x,
        __value: sum(x, metricProperties),
        __date: timestampToDate(x.date_start_unix),
      }))
      .filter((x) => isPresent(x.__value));
  }

  throw new Error(
    `Incompatible timestamps are used in value ${valuesInFrame[0]}`
  );
}
