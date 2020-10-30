import { Municipal, National, Regionaal } from '~/types/data.d';

export function sortNationalTimeSeriesInDataInPlace(data: National) {
  const timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);

  for (const propertyName of timeSeriesPropertyNames) {
    const timeSeries = data[propertyName] as TimeSeriesData<Timestamped>;
    timeSeries.values = sortTimeSeriesValues(timeSeries.values);
  }
}

export function sortRegionalTimeSeriesInDataInPlace(data: Regionaal) {
  const timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);

  for (const propertyName of timeSeriesPropertyNames) {
    /**
     * There is one property in the dataset that contains timeseries nested
     * inside values, so we need to process that separately.
     */
    if (propertyName === 'sewer_per_installation') {
      const nestedSeries = data[propertyName] as SewerTimeSeriesData<
        Timestamped
      >;

      nestedSeries.values = nestedSeries.values.map((x) => {
        x.values = sortTimeSeriesValues(x.values);
        return x;
      });

      // Skip the remainder of this loop
      continue;
    }

    const timeSeries = data[propertyName] as TimeSeriesData<Timestamped>;
    timeSeries.values = sortTimeSeriesValues(timeSeries.values);
  }
}

export function sortMunicipalTimeSeriesInDataInPlace(data: Municipal) {
  const timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);

  for (const propertyName of timeSeriesPropertyNames) {
    /**
     * There is one property in the dataset that contains timeseries nested
     * inside values, so we need to process that separately.
     */
    if (propertyName === 'sewer_per_installation') {
      const nestedSeries = data[propertyName] as SewerTimeSeriesData<
        Timestamped
      >;

      nestedSeries.values = nestedSeries.values.map((x) => {
        x.values = sortTimeSeriesValues(x.values);
        return x;
      });

      // Skip the remainder of this loop
      continue;
    }

    const timeSeries = data[propertyName] as TimeSeriesData<Timestamped>;
    timeSeries.values = sortTimeSeriesValues(timeSeries.values);
  }
}

/**
 * From the data structure, retrieve all properties that hold a "values" field
 * in their content. All time series data is kept in this values field.
 */
function getTimeSeriesPropertyNames<T>(data: T) {
  return Object.entries(data).reduce(
    (acc, [propertyKey, propertyValue]) =>
      isTimeSeries(propertyValue) ? [...acc, propertyKey as keyof T] : acc,
    [] as (keyof T)[]
  );
}

function sortTimeSeriesValues(values: Timestamped[]) {
  /**
   * There are 3 ways in which time series data can be timestamped. We need
   * to detect and handle each of them.
   */
  if (isReportTimestamped(values)) {
    return values.sort((a, b) => a.date_of_report_unix - b.date_of_report_unix);
  } else if (isWeekTimestamped(values)) {
    return values.sort((a, b) => a.week_unix - b.week_unix);
  } else if (isMeasurementTimestamped(values)) {
    return values.sort(
      (a, b) => a.date_measurement_unix - b.date_measurement_unix
    );
  }

  /**
   * If none match we throw, since it means an unknown timestamp is used and we
   * want to be sure we sort all data.
   */
  throw new Error(
    `Unknown timestamp in value ${JSON.stringify(values[0], null, 2)}`
  );
}

type Timestamped = ReportTimestamped | WeekTimestamped | MeasurementTimestamped;

interface ReportTimestamped {
  date_of_report_unix: number;
}

interface WeekTimestamped {
  week_unix: number;
}

interface MeasurementTimestamped {
  date_measurement_unix: number;
}

interface TimeSeriesData<T> {
  values: T[];
}

interface SewerTimeSeriesData<T> {
  values: TimeSeriesData<T>[];
}

/**
 * Some type guards to figure out types based on runtime properties.
 * See: https://basarat.gitbook.io/typescript/type-system/typeguard#user-defined-type-guards
 */
function isTimeSeries(
  value: unknown | TimeSeriesData<Timestamped>
): value is TimeSeriesData<Timestamped> {
  return (value as TimeSeriesData<Timestamped>).values !== undefined;
}

function isReportTimestamped(
  timeSeries: Timestamped[]
): timeSeries is ReportTimestamped[] {
  return (
    (timeSeries as ReportTimestamped[])[0].date_of_report_unix !== undefined
  );
}

function isWeekTimestamped(
  timeSeries: Timestamped[]
): timeSeries is WeekTimestamped[] {
  return (timeSeries as WeekTimestamped[])[0].week_unix !== undefined;
}

function isMeasurementTimestamped(
  timeSeries: Timestamped[]
): timeSeries is MeasurementTimestamped[] {
  return (
    (timeSeries as MeasurementTimestamped[])[0].date_measurement_unix !==
    undefined
  );
}
