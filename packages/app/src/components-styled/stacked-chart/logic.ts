import { isDefined, isPresent } from 'ts-is-present';
import { assert } from '~/utils/assert';
import { getDaysForTimeframe, TimeframeOption } from '~/utils/timeframe';
import { pick, zip } from 'lodash';

// export type Value = DailyValue | WeeklyValue;
export type Value = DateValue | DateSpanValue;

// This type limits the allowed property names to those with a number type,
// so its like keyof T, but filtered down to only the appropriate properties.
export type NumberProperty<T extends Value> = {
  [K in keyof T]: T[K] extends number | null ? K : never;
}[keyof T];

export interface DateValue {
  date_unix: number;
}

export type DateSpanValue = {
  date_start_unix: number;
  date_end_unix: number;
};

/**
 * To read an arbitrary value property from the passed in data, we need to cast
 * the type to a dictionary internally, otherwise TS will complain the index
 * signature is missing on the passed in value type T.
 */
export type AnyValue = Record<string, number | null>;
export type AnyFilteredValue = Record<string, number>;

export function isDateValue(value: Value): value is DateValue {
  return (value as DateValue).date_unix !== undefined;
}

export function isDateSpanValue(value: Value): value is DateSpanValue {
  return (
    (value as DateSpanValue).date_start_unix !== undefined &&
    (value as DateSpanValue).date_end_unix !== undefined
  );
}

export function isDateSeries(series: Value[]): series is DateValue[] {
  const firstValue = (series as DateValue[])[0];

  assert(
    isDefined(firstValue),
    'Unable to determine timestamps if time series is empty'
  );

  return firstValue.date_unix !== undefined;
}

export function isDateSpanSeries(
  series: Value[]
): series is DateSpanValue[] {
  const firstValue = (series as DateSpanValue[])[0];

  assert(
    isDefined(firstValue),
    'Unable to determine timestamps if time series is empty'
  );

  return (
    firstValue.date_start_unix !== undefined &&
    firstValue.date_end_unix !== undefined
  );
}

/**
 * Stack all values by zipping each position for every trend then summing
 * the together like the bar stack and finding the position with the highest
 * sum.
 */
export function calculateYMaxStacked(series: TrendPoints[]) {

  function sumTrendValues

  const stackedValues = series.map((x) =>
    sumValues(x

      .map((x) => x.__value)
      .reduce((acc, value) => acc + value, 0)
  );

  return Math.max(...stackedValues);
}

/**
 * From a list of values, return the ones that are within the timeframe.
 *
 * This is similar to getFilteredValues but here we assume the value is passed
 * in as-is from the data, and we detect what type of timestamp we should filter
 * on.
 */
export function getValuesInTimeframe<T extends Value>(
  values: T[],
  timeframe: TimeframeOption
) {
  const boundary = getTimeframeBoundaryUnix(timeframe);

  if (isDateSeries(values)) {
    return values.filter((x: DateValue) => x.date_unix >= boundary);
  }

  if (isDateSpanSeries(values)) {
    return values.filter((x: DateSpanValue) => x.date_start_unix >= boundary);
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}

const oneDayInSeconds = 24 * 60 * 60;

function getTimeframeBoundaryUnix(timeframe: TimeframeOption) {
  if (timeframe === 'all') {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return Date.now() / 1000 - days * oneDayInSeconds;
}

// export type TrendValue = {
//   __date: Date;
//   __value: number;
// };

export type TrendPoints = {
  __date: Date;
  // __value: number;
  __value: { [key: string]: number };
};

const timestampToDate = (d: number) => new Date(d * 1000);

export function getTrendData<T extends Value>(
  values: Value[],
  // valueKeys: NumberProperty<T>[]
  valueKeys: (keyof T)[]
): TrendPoints[] {
  return values.map(
    (x) =>
      ({
        __value: pick(x, valueKeys),
        __date: getDateFromValue(x),
      } as TrendPoints)
  );
}

function getDateFromValue<T extends Value>(value: T) {
  if (isDateValue(value)) {
    return timestampToDate(value.date_unix);
  }

  if (isDateSpanValue(value)) {
    return timestampToDate(value.date_start_unix);
  }

  throw new Error(`Incompatible timestamps are used in value ${value}`);
}

// export function getSingleTrendData<T extends Value>(
//   values: Value[],
//   valueKey: keyof T
// ): TrendValue[] {
//   if (isDateSeries(values)) {
//     return values
//       .map((x: DateValue) => ({
//         // ...x,
//         /**
//          * Not sure why we need to cast to number if isPresent is used to filter
//          * out the null values.
//          */
//         __value: x[valueKey as keyof DateValue],
//         __date: timestampToDate(x.date_unix),
//       }))
//       .filter((x) => isPresent(x.__value));
//   }

//   if (isDateSpanSeries(values)) {
//     return values
//       .map((x: DateSpanValue) => ({
//         // ...x,
//         /**
//          * Not sure why we need to cast to number if isPresent is used to filter
//          * out the null values.
//          */
//         __value: x[valueKey as keyof DateSpanValue],
//         __date: timestampToDate(x.date_start_unix),
//       }))
//       .filter((x) => isPresent(x.__value));
//   }

//   throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
// }
