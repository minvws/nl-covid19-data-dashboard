import { isPresent } from 'ts-is-present';
import { getDaysForTimeframe, TimeframeOption } from '~/utils/timeframe';

export type Value = DailyValue | WeeklyValue;

export type DailyValue = {
  date_of_report_unix: number;
  [key: string]: number | null;
};

export type WeeklyValue = {
  week_start_unix: number;
  week_end_unix: number;
  [key: string]: number | null;
};

export function isDailyValue(timeSeries: Value[]): timeSeries is DailyValue[] {
  return (timeSeries as DailyValue[])[0].date_of_report_unix !== undefined;
}

export function isWeeklyValue(
  timeSeries: Value[]
): timeSeries is WeeklyValue[] {
  return (timeSeries as WeeklyValue[])[0].week_end_unix !== undefined;
}

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis. We need to do this for each fo the keys that are used to
 * render lines, so that the axis scales with whatever key contains the highest
 * values.
 */
export function calculateYMax(
  values: Value[],
  valueKeys: string[],
  signaalwaarde = -Infinity
) {
  const peakValues: number[] = [];

  for (const key in valueKeys) {
    const peakValue = values
      .map((x) => x[key])
      .filter(isPresent) // omit null values
      .reduce((acc, value) => (value > acc ? value : acc), -Infinity);

    peakValues.push(peakValue);
  }

  const overallMaximum = Math.max(...peakValues);

  /**
   * Value cannot be 0, hence the 1 If the value is below signaalwaarde, make
   * sure the signaalwaarde floats in the middle
   */
  return Math.max(overallMaximum, signaalwaarde * 2, 1);
}

/**
 * From a list of values, return the ones that are within the timeframe.
 *
 * This is similar to getFilteredValues but here we assume the value is passed
 * in as-is from the data, and we detect what type of timestamp we should filter
 * on.
 */
export function getTimeframeValues(
  values: Value[],
  timeframe: TimeframeOption
) {
  const boundary = getTimeframeBoundaryUnix(timeframe);

  if (isDailyValue(values)) {
    return values.filter((x) => x.date_of_report_unix >= boundary);
  }

  if (isWeeklyValue(values)) {
    return values.filter((x) => x.week_start_unix >= boundary);
  }

  throw new Error(`Incompatible timestamps are used in value ${values[0]}`);
}

const oneDayInSeconds = 24 * 60 * 60;

function getTimeframeBoundaryUnix(timeframe: TimeframeOption) {
  if (timeframe === 'all') {
    return 0;
  }
  const days = getDaysForTimeframe(timeframe);
  return new Date().getTime() - days * oneDayInSeconds;
}

// const valueToDate = (d: number) => new Date(d * 1000);

export type TrendValue = {
  date_unix: number;
  value: number;
  // [key: string]: number;
};

// export type DataPoint = {
//   date_unix: number;
//   value: number;
// };

export function getTrendData(
  values: Value[],
  valueKey: string,
  timeframe: TimeframeOption
): TrendValue[] {
  /**
   * Not sure why we need to cast to Value[] here. The map function won't allow
   * mapping over DailyValue[] | WeeklyValue[]
   */
  const valuesInFrame = getTimeframeValues(values, timeframe) as Value[];

  if (isDailyValue(valuesInFrame)) {
    return valuesInFrame
      .map((x) => ({
        /**
         * Not sure why we need to cast to number if isPresent is used to filter
         * out the null values.
         */
        value: x[valueKey] as number,
        date_unix: x.date_of_report_unix,
      }))
      .filter((x) => isPresent(x.value));
  }

  if (isWeeklyValue(valuesInFrame)) {
    return valuesInFrame
      .map((x) => ({
        value: x[valueKey] as number,
        date_unix: x.week_start_unix,
      }))
      .filter((x) => isPresent(x.value));
  }

  throw new Error(
    `Incompatible timestamps are used in value ${valuesInFrame[0]}`
  );
}
