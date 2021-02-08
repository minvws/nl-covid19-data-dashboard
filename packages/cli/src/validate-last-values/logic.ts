import fs from 'fs';
import { chain } from 'lodash';

const NON_TIME_SERIES_PROPERTIES: string[] = [
  'last_generated',
  'proto_name',
  'name',
  'code',
  'difference',
];

export function getTimeSeriesMetricProperties(object: UnknownObject) {
  return Object.keys(object).filter(
    (x) => !NON_TIME_SERIES_PROPERTIES.includes(x)
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

export type UnknownObject = Record<string, unknown>;

export type TimeSeriesMetric<T> = {
  values: T[];
  last_value: T;
};

export type ValidationResult = {
  success: boolean;
  metricProperty: string;
};

export function validateLastValue(
  data: Record<string, TimeSeriesMetric<UnknownObject>>,
  metricProperty: string
): ValidationResult {
  const timeSeries = data[metricProperty];

  const assumedLastValue = timeSeries.last_value;
  const actualLastValue = timeSeries.values[timeSeries.values.length - 1];

  const success = chain(assumedLastValue)
    .entries()
    .every(([key, value]) => actualLastValue[key] === value)
    .value();

  return { success, metricProperty };
}
