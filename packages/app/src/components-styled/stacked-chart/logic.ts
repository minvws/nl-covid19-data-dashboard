import { omit, pick, mapValues } from 'lodash';
import { getDaysForTimeframe, TimeframeOption } from '~/utils/timeframe';
import {
  DateValue,
  DateSpanValue,
  isDateSeries,
  isDateSpanSeries,
  isDateValue,
  isDateSpanValue,
  TimestampedValue,
} from '@corona-dashboard/common';

/**
 * A SeriesValue contains the properties for all trend values in key/value
 * pairs. This function sums all property values together and then returns the
 * highest sum for all. The __date property is a special case which needs to be
 * omitted.
 */
export function calculateSeriesMaximum(series: SeriesValue[]) {
  function sumTrendPointValue(point: SeriesValue) {
    return Object.values(omit(point, ['__date'])).reduce(
      (sum, v) => sum + v,
      0
    );
  }

  const stackedSumValues = series.map(sumTrendPointValue);

  return Math.max(...stackedSumValues);
}

/**
 * From a list of values, return the ones that are within the timeframe.
 *
 * This is similar to getFilteredValues but here we assume the value is passed
 * in as-is from the data, and we detect what type of timestamp we should filter
 * on.
 */
export function getValuesInTimeframe<T extends TimestampedValue>(
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

/**
 * The SeriesValue is a generic container for the chart data. The original data
 * that is passed in gets converted into this object for each position in the
 * time series. The passed in config propertyName keys are used to pick the data
 * that appears here.
 *
 * A special __date property is reserved for whatever timestamp is found in the
 * data. This can be a daily timestamp or date span.
 */
export type SeriesValue = {
  __date: Date;
} & { [key: string]: number };

const timestampToDate = (d: number) => new Date(d * 1000);

/**
 * This function converts the passed in data to the generic SeriesValue
 * container.
 */
export function getSeriesData<T extends TimestampedValue>(
  metricValues: TimestampedValue[],
  metricProperties: (keyof T)[]
): SeriesValue[] {
  return metricValues.map(
    (x) =>
      ({
        ...mapValues(pick(x, metricProperties), (v) => v),
        __date: getDateFromValue(x),
      } as SeriesValue)
  );
}

function getDateFromValue<T extends TimestampedValue>(value: T) {
  if (isDateValue(value)) {
    return timestampToDate(value.date_unix);
  }

  if (isDateSpanValue(value)) {
    return timestampToDate(value.date_start_unix);
  }

  throw new Error(`Incompatible timestamps are used in value ${value}`);
}

export function getTotalSumForMetricProperty(
  values: Record<string, number>[],
  metricProperty: string
) {
  return values.reduce((acc, v) => acc + v[metricProperty] || 0, 0);
}

/**
 * Code inspired by
 * https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 *
 * For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year is the year of the week
 * number. Then get weeks between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous or next year, overlap is
 * up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015 2012/1/1   is Sunday in week 52
 *      of 2011
 */

export function getWeekInfo(d: Date) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number Make
  // Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  const weekStartDate = new Date(d.getTime());
  weekStartDate.setUTCDate(weekStartDate.getUTCDate() - 3);

  const weekEndDate = new Date(d.getTime());
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 3);

  return {
    year: d.getUTCFullYear(),
    weekNumber,
    weekStartDate,
    weekEndDate,
  } as const;
}

export function formatDayMonth(date: Date) {
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
  const mo = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
  const da = new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(date);
  return `${da} ${mo}`;
}
