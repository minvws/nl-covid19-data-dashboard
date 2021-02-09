import fs from 'fs';
import { chain } from 'lodash';
import { isDefined } from 'ts-is-present';
import {
  UnknownObject,
  TimeSeriesMetric,
  TimestampedValue,
  isDateSeries,
  isDateSpanSeries,
  isTimeSeries,
} from '@corona-dashboard/common';

// const NON_TIME_SERIES_PROPERTIES: string[] = [
//   'last_generated',
//   'proto_name',
//   'name',
//   'code',
//   'difference',
//   /**
//    * @TODO this looks like a mistake. deceased_rivm_per_age_group is now the only
//    * schema where data doesn't have a date_unix timestamp, so I think we should
//    * add it instead of creating an exception for it. I think we better strive to
//    * keep data structures consistent.
//    *
//    * More so because we also have tested_per_age_group which is very similar
//    * and has a timestamp.
//    */
//   'deceased_rivm_per_age_group',
// ];

export function getTimeSeriesMetricProperties(object: UnknownObject) {
  return Object.keys(object).filter(
    // (x) => !NON_TIME_SERIES_PROPERTIES.includes(x)
    (key) => isTimeSeries(object[key])
  );
}

export function readJsonFile(filePath: string): UnknownObject {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (err) {
    throw new Error(`Failed to read JSON file ${filePath}`);
  }
}

export type ValidationResult = {
  success: boolean;
  metricProperty: string;
};

export function validateLastValue(
  data: Record<string, TimeSeriesMetric<TimestampedValue>>,
  metricProperty: string
): ValidationResult {
  const metric = data[metricProperty];
  const assumedLastValue = metric.last_value;
  const actualLastValue = metric.values[metric.values.length - 1];

  const success = chain(assumedLastValue)
    .entries()
    .every(([key, value]) => actualLastValue[key] === value)
    .value();

  return { success, metricProperty };
}

// /**
//  * @TODO This logic was kind of copied from packages/app/data-sorting, maybe
//  * move to common package later and share. Some charts use similar types too.
//  */

// export type TimestampedValue = DateValue | DateSpanValue;

// interface DateValue extends UnknownObject {
//   date_unix: number;
// }

// interface DateSpanValue extends UnknownObject {
//   date_start_unix: number;
//   date_end_unix: number;
// }

// function isDateSeries(
//   timeSeries: TimestampedValue[]
// ): timeSeries is DateValue[] {
//   const firstValue = (timeSeries as DateValue[])[0];
//   return isDefined(firstValue.date_unix);
// }

// function isDateSpanSeries(
//   timeSeries: TimestampedValue[]
// ): timeSeries is DateSpanValue[] {
//   const firstValue = (timeSeries as DateSpanValue[])[0];
//   return (
//     isDefined(firstValue.date_end_unix) && isDefined(firstValue.date_start_unix)
//   );
// }

// function isTimeSeries(
//   value: unknown | TimeSeriesMetric<TimestampedValue>
// ): value is TimeSeriesMetric<TimestampedValue> {
//   const metric = value as TimeSeriesMetric<TimestampedValue>;
//   return isDefined(metric.values) && isDefined(metric.last_value);
// }

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
