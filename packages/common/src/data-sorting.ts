import { isDefined } from 'ts-is-present';
import {
  MunicipalSewerPerInstallationValue,
  RegionalSewerPerInstallationValue,
} from './types';

export type UnknownObject = Record<string, unknown>;

export function sortTimeSeriesInDataInPlace<T>(
  data: T,
  { setDatesToMiddleOfDay = false } = {}
) {
  const timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);

  for (const propertyName of timeSeriesPropertyNames) {
    const timeSeries = data[propertyName] as unknown as TimeSeriesMetric;
    timeSeries.values = sortTimeSeriesValues(timeSeries.values);

    if (setDatesToMiddleOfDay) {
      /**
       * We'll map all dates to midday (12:00). This simplifies the rendering of a
       * marker/annotation on a date.
       */
      timeSeries.values = timeSeries.values.map(setValueDatesToMiddleOfDay);

      if (timeSeries.last_value) {
        timeSeries.last_value = setValueDatesToMiddleOfDay(
          timeSeries.last_value
        );
      }
    }
  }

  /**
   * There is one property in the dataset that contains timeseries nested
   * inside values, so we need to process that separately.
   */
  if (isDefined((data as UnknownObject).sewer_per_installation)) {
    const nestedSeries = (data as UnknownObject)
      .sewer_per_installation as SewerPerInstallationData;

    if (!nestedSeries.values) {
      /**
       * It can happen that we get incomplete json data and assuming that values
       * exists here might crash the app
       */
      console.error('sewer_per_installation.values does not exist');
      return;
    }

    nestedSeries.values = nestedSeries.values.map((x) => {
      x.values = sortTimeSeriesValues(x.values) as
        | RegionalSewerPerInstallationValue[]
        | MunicipalSewerPerInstallationValue[];

      if (setDatesToMiddleOfDay) {
        x.values = x.values.map(setValueDatesToMiddleOfDay);

        if (x.last_value) {
          x.last_value = setValueDatesToMiddleOfDay(x.last_value);
        }
      }
      return x;
    });
  }
}

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

function setValueDatesToMiddleOfDay<T extends TimestampedValue>(value: T) {
  if (isDateSpanValue(value)) {
    value.date_start_unix = middleOfDayInSeconds(value.date_start_unix);
    value.date_end_unix = middleOfDayInSeconds(value.date_end_unix);
  }
  if (isDateValue(value)) {
    value.date_unix = middleOfDayInSeconds(value.date_unix);
  }

  return value;
}

export type TimestampedValue = DateValue | DateSpanValue;

export interface DateValue {
  date_unix: number;
}

export interface DateSpanValue {
  date_start_unix: number;
  date_end_unix: number;
}

export interface TimeSeriesMetric<T = TimestampedValue> {
  values: T[];
  last_value: T;
}

export interface SewerPerInstallationData {
  values: (TimeSeriesMetric<
    RegionalSewerPerInstallationValue | MunicipalSewerPerInstallationValue
  > & {
    rwzi_awzi_name: string;
  })[];
}

/**
 * Some type guards to figure out types based on runtime properties. See:
 * https://basarat.gitbook.io/typescript/type-system/typeguard#user-defined-type-guards
 */

export function isDateValue(value: TimestampedValue): value is DateValue {
  return isDefined((value as DateValue).date_unix);
}

export function isDateSpanValue(
  value: TimestampedValue
): value is DateSpanValue {
  return (
    isDefined((value as DateSpanValue).date_start_unix) &&
    isDefined((value as DateSpanValue).date_end_unix)
  );
}

export function isTimeSeries(
  value: unknown | TimeSeriesMetric
): value is TimeSeriesMetric {
  const metric = value as TimeSeriesMetric;
  return isDefined(metric.values) && isDefined(metric.last_value);
}

export function isDateSeries(
  timeSeries: TimestampedValue[]
): timeSeries is DateValue[] {
  const firstValue = (timeSeries as DateValue[])[0];
  return isDefined(firstValue?.date_unix);
}

export function isDateSpanSeries(
  timeSeries: TimestampedValue[]
): timeSeries is DateSpanValue[] {
  const firstValue = (timeSeries as DateSpanValue[])[0];
  return (
    isDefined(firstValue?.date_end_unix) &&
    isDefined(firstValue?.date_start_unix)
  );
}

export function startOfDayInSeconds(seconds: number) {
  const date = new Date(seconds * 1000);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
}

export function endOfDayInSeconds(seconds: number) {
  const date = new Date(seconds * 1000);
  date.setHours(23, 59, 59, 999);
  return Math.floor(date.getTime() / 1000);
}

export function middleOfDayInSeconds(seconds: number) {
  const date = new Date(seconds * 1000);
  date.setHours(12, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
}
