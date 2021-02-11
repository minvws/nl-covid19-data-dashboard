import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import {
  getTimeframeValues,
  TrendValueWithTimestamp,
} from '~/components-styled/line-chart/logic';
import { timestampToDate } from '~/components-styled/stacked-chart/logic';
import { TimeframeOption } from '~/utils/timeframe';
import { createUniqueId } from '~/utils/useUniqueId';
import { AreaDescriptor } from '../area-chart';
import { AreaConfig } from '../area-chart-graph';

export function useAreaConfigs<T extends TimestampedValue>(
  areaDescriptors: AreaDescriptor<T>[],
  timeframe: TimeframeOption
): AreaConfig<T & TrendValueWithTimestamp>[] {
  const areaConfigs = useMemo(() => {
    return areaDescriptors.map<AreaConfig<T & TrendValueWithTimestamp>>(
      (descriptor) => ({
        values: getAreaData(
          descriptor.values,
          descriptor.displays.map((x) => x.metricProperty),
          timeframe
        ),
        displays: [
          ...descriptor.displays.map((x) => ({ id: createUniqueId(), ...x })),
        ],
      })
    );
  }, [areaDescriptors, timeframe]);

  return areaConfigs;
}

export function getAreaData<T extends TimestampedValue>(
  values: T[],
  metricProperties: (keyof T)[],
  timeframe: TimeframeOption
): (T & TrendValueWithTimestamp)[] {
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
      .map<T & TrendValueWithTimestamp>((x: any) => ({
        ...x,
        __value: sum(x, metricProperties),
        __date: timestampToDate(x.date_unix),
      }))
      .filter((x) => isPresent(x.__value));
  }

  if (isDateSpanSeries(valuesInFrame)) {
    return valuesInFrame
      .map<T & TrendValueWithTimestamp>((x: any) => ({
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
