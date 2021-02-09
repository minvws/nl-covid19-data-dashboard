import { isDefined } from 'ts-is-present';
// import { Municipal, National, Regionaal } from '~/types';

// export function sortNationalTimeSeriesInDataInPlace(data: National) {
//   const timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);

//   for (const propertyName of timeSeriesPropertyNames) {
//     const timeSeries = data[propertyName] as TimeSeriesMetric<TimestampedValue>;
//     timeSeries.values = sortTimeSeriesValues(timeSeries.values);
//   }
// }

export type UnknownObject = Record<string, unknown>;

export function sortTimeSeriesInDataInPlace(data: UnknownObject) {
  const timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);

  for (const propertyName of timeSeriesPropertyNames) {
    // if (isWhitelistedProperty(propertyName)) {
    //   continue;
    // }

    /**
     * There is one property in the dataset that contains timeseries nested
     * inside values, so we need to process that separately.
     */
    if (propertyName === 'sewer_per_installation') {
      const nestedSeries = data[
        propertyName
      ] as SewerTimeSeriesData<TimestampedValue>;

      nestedSeries.values = nestedSeries.values.map((x) => {
        x.values = sortTimeSeriesValues(x.values);
        return x;
      });

      // Skip the remainder of this loop
      continue;
    }

    const timeSeries = data[propertyName] as TimeSeriesMetric<TimestampedValue>;
    timeSeries.values = sortTimeSeriesValues(timeSeries.values);
  }
}

// export function sortMunicipalTimeSeriesInDataInPlace(data: Municipal) {
//   const timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);

//   for (const propertyName of timeSeriesPropertyNames) {
//     // if (isWhitelistedProperty(propertyName)) {
//     //   continue;
//     // }
//     /**
//      * There is one property in the dataset that contains timeseries nested
//      * inside values, so we need to process that separately.
//      */
//     if (propertyName === 'sewer_per_installation') {
//       const nestedSeries = data[
//         propertyName
//       ] as SewerTimeSeriesData<TimestampedValue>;

//       nestedSeries.values = nestedSeries.values.map((x) => {
//         x.values = sortTimeSeriesValues(x.values);
//         return x;
//       });

//       // Skip the remainder of this loop
//       continue;
//     }

//     const timeSeries = data[propertyName] as TimeSeriesMetric<TimestampedValue>;
//     timeSeries.values = sortTimeSeriesValues(timeSeries.values);
//   }
// }

/**
 * From the data structure, retrieve all properties that hold a "values" field
 * in their content. All time series data is kept in this values field.
 */
export function getTimeSeriesPropertyNames<T>(data: T) {
  return Object.entries(data).reduce(
    (acc, [propertyKey, propertyValue]) =>
      isTimeSeries(propertyValue) ? [...acc, propertyKey as keyof T] : acc,
    [] as (keyof T)[]
  );
}

export function sortTimeSeriesValues(values: TimestampedValue[]) {
  /**
   * There are 3 ways in which time series data can be timestamped. We need to
   * detect and handle each of them.
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

export type TimestampedValue = DateValue | DateSpanValue;

export interface DateValue extends UnknownObject {
  date_unix: number;
}

export interface DateSpanValue extends UnknownObject {
  date_start_unix: number;
  date_end_unix: number;
}

export interface TimeSeriesMetric<T> {
  values: T[];
  last_value: T;
}

interface SewerTimeSeriesData<T> {
  values: TimeSeriesMetric<T>[];
}

/**
 * Some type guards to figure out types based on runtime properties. See:
 * https://basarat.gitbook.io/typescript/type-system/typeguard#user-defined-type-guards
 */
export function isTimeSeries(
  value: unknown | TimeSeriesMetric<TimestampedValue>
): value is TimeSeriesMetric<TimestampedValue> {
  const metric = value as TimeSeriesMetric<TimestampedValue>;
  return isDefined(metric.values) && isDefined(metric.last_value);
}

export function isDateSeries(
  timeSeries: TimestampedValue[]
): timeSeries is DateValue[] {
  const firstValue = (timeSeries as DateValue[])[0];
  return isDefined(firstValue.date_unix);
}

export function isDateSpanSeries(
  timeSeries: TimestampedValue[]
): timeSeries is DateSpanValue[] {
  const firstValue = (timeSeries as DateSpanValue[])[0];
  return (
    isDefined(firstValue.date_end_unix) && isDefined(firstValue.date_start_unix)
  );
}

// /**
//  * @TODO this looks like a mistake. deceased_rivm_per_age_group is now the only
//  * schema where data doesn't have a date_unix timestamp, so I think we should
//  * add it instead of creating an exception for it. I think we better strive to
//  * keep data structures consistent.
//  *
//  * More so because we also have tested_per_age_group which is very similar
//  * and has a timestamp.
//  */
// function isWhitelistedProperty(propertyName: string) {
//   return ['deceased_rivm_per_age_group'].includes(propertyName);
// }
