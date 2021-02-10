import fs from 'fs';
import { chain } from 'lodash';
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

export function readJsonFile(filePath: string): UnknownObject {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (err) {
    throw new Error(`Failed to read JSON file ${filePath}`);
  }
}

export function validateLastValue(
  metric: TimeSeriesMetric<TimestampedValue>
): boolean {
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
   * There are 3 ways in which time series data can be timestamped. We need
   * to detect and handle each of them.
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
