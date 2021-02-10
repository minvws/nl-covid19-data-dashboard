import fs from 'fs';
import { chain, isArray } from 'lodash';
import {
  UnknownObject,
  TimeSeriesMetric,
  TimestampedValue,
  isDateSeries,
  isDateSpanSeries,
  isTimeSeries,
} from '@corona-dashboard/common';

export function getTimeSeriesMetricNames(object: UnknownObject) {
  return Object.keys(object).filter((key) => isTimeSeries(object[key]));
}

export function readObjectFromJsonFile(filePath: string): UnknownObject {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const result = JSON.parse(fileContents);

    if (isArray(result)) {
      throw new Error(`Read data is an array instead of expected object`);
    }

    return result;
  } catch (err) {
    throw new Error(`Failed to read JSON file ${filePath}`);
  }
}

export function validateLastValue(metric: TimeSeriesMetric): boolean {
  const assumedLastValue = metric.last_value;
  const actualLastValue = metric.values[metric.values.length - 1];

  const success = chain(assumedLastValue)
    .entries()
    .every(
      ([key, value]) =>
        actualLastValue[key as keyof typeof actualLastValue] === value
    )
    .value();

  return success;
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
