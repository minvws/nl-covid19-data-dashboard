import {
  isDateSeries,
  isDateSpanSeries,
  isTimeSeries,
  TimeSeriesMetric,
  TimestampedValue,
  UnknownObject,
} from '@corona-dashboard/common';

export function getTimeSeriesMetricNames(object: UnknownObject) {
  return Object.keys(object).filter((key) => isTimeSeries(object[key]));
}

export function sortTimeSeriesValues(values: TimestampedValue[]) {
  /**
   * There are 2 ways in which time series data can be timestamped. We need
   * to detect and handle them separately.
   */
  if (isDateSeries(values)) {
    return values.sort((a, b) => a.date_unix - b.date_unix);
  } else if (isDateSpanSeries(values)) {
    return values.sort((a, b) => a.date_end_unix - b.date_end_unix);
  }

  /**
   * If none match we throw, since it means an unknown timestamp is used and we
   * want to be sure we sort all data.
   */
  throw new Error(
    `Unknown timestamp in value ${JSON.stringify(values[0], null, 2)}`
  );
}
