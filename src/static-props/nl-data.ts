import fs from 'fs';
import path from 'path';
import { National } from '~/types/data.d';

export interface INationalData {
  data: National;
  lastGenerated: string;
  text?: any;
}

interface IProps {
  props: INationalData;
}

/*
 * getNlData loads the data for /landelijk pages.
 * It needs to be used as the Next.js `getStaticProps` function.
 *
 * Example:
 * ```ts
 * PositivelyTestedPeople.getLayout = getNationalLayout();
 *
 * export const getStaticProps = getNlData();
 *
 * export default PositivelyTestedPeople;
 * ```
 *
 * The `INationalData` should be used in conjunction with `FCWithLayout`
 *
 * Example:
 * ```ts
 * const PositivelyTestedPeople: FCWithLayout<INationalData> = props => {
 *   // ...
 * }
 * ```
 */
export default function getNlData(): () => IProps {
  return function () {
    const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as National;

    const lastGenerated = data.last_generated;

    sortTimeSeriesInDataInPlace(data);

    return {
      props: {
        data,
        lastGenerated,
      },
    };
  };
}

/**
 * Sort all time series properties in the data in-place, meaning the input
 * data is mutated.
 */
function sortTimeSeriesInDataInPlace(data: National) {
  const timeSeriesPropertyNames = getTimeSeriesPropertyNames(data);
  // console.log('+++ timeSeriesPropertyNames', timeSeriesPropertyNames);

  for (const propertyName of timeSeriesPropertyNames) {
    const timeSeries = data[propertyName] as TimeSeriesData<Timestamped>;
    (data[propertyName] as TimeSeriesData<
      Timestamped
    >).values = sortTimeSeriesValues(timeSeries.values);
  }
}
/**
 * From the data structure, retrieve all properties that hold a "values" field
 * in their content. All time series data is kept in this values field.
 */
function getTimeSeriesPropertyNames(data: National) {
  return Object.entries(data).reduce(
    (acc, [propertyKey, propertyValue]) =>
      isTimeSeries(propertyValue)
        ? [...acc, propertyKey as keyof National]
        : acc,
    [] as (keyof National)[]
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

function sortTimeSeriesValues(values: Timestamped[]): Timestamped[] {
  if (isReportTimestamped(values)) {
    return values.sort((a, b) => a.date_of_report_unix - b.date_of_report_unix);
  } else if (isWeekTimestamped(values)) {
    return values.sort((a, b) => a.week_unix - b.week_unix);
  } else if (isMeasurementTimestamped(values)) {
    return values.sort(
      (a, b) => a.date_measurement_unix - b.date_measurement_unix
    );
  }

  throw new Error(
    `Unknown timestamp in value ${JSON.stringify(values[0], null, 2)}`
  );
}

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
