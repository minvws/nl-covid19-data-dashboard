import { isTimeSeries, UnknownObject } from '@corona-dashboard/common';

export function getTimeSeriesMetricNames(object: UnknownObject) {
  return Object.keys(object).filter((key) => isTimeSeries(object[key]));
}
