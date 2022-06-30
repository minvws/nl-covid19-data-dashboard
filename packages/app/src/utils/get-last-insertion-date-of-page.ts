import { get } from 'lodash';
/**
 * This method gets the most recent insertion date from the metrics used in a page
 *
 */

//functions for checking type of metric
function hasLastValue(metric: any): boolean {
  return typeof metric?.last_value?.date_of_insertion_unix !== 'undefined';
}

function hasValues(metric: any): boolean {
  return Array.isArray(metric?.values) ?
    typeof metric?.values[metric?.values.length - 1]?.date_of_insertion_unix !== 'undefined'
    : false;
}

function hasInsertionDate(metric: any): boolean {
  return typeof metric?.date_of_insertion_unix !== 'undefined'
}

function hasNestedLastValue(metric: any): boolean {
  return Array.isArray(metric?.values) ?
    typeof metric?.values[0]?.last_value?.date_of_insertion_unix !== 'undefined'
    : false;
}

// functions for getting values
function getDateFromLastValue(metric: any): number {
  return metric?.last_value?.date_of_insertion_unix;
}

function getDateFromValues(metric: any): number {
  return metric?.values[metric.values.length - 1]?.date_of_insertion_unix
}

function getDateFromInsertionDate(metric: any): number {
  return metric?.date_of_insertion_unix;
}

function getDateFromNestedLastValue(metric: any): number {
  return metric?.values.reduce((lastDate :number, innerValue: any) => {
    const metricDate = getMetricDate(innerValue);
    return Math.max(metricDate, lastDate);
  }, 0);
}

function getMetricDate(metricOrUnixDate: any): number {
  if (hasLastValue(metricOrUnixDate)) {
    return getDateFromLastValue(metricOrUnixDate);
  }
  if (hasValues(metricOrUnixDate)) {
    return getDateFromValues(metricOrUnixDate);
  }
  if (hasInsertionDate(metricOrUnixDate)) {
    return getDateFromInsertionDate(metricOrUnixDate);
  }
  if (hasNestedLastValue(metricOrUnixDate)) {
    return getDateFromNestedLastValue(metricOrUnixDate);
  }
  return 0;
}

export function getLastInsertionDateOfPage(
  data: unknown,
  pageMetrics: string[]
) {
  return pageMetrics.reduce((lastDate, metricProperty) => {
    const metric: any = get(data, metricProperty);
    const metricDate = getMetricDate(metric);
    
    return Math.max(metricDate, lastDate);
  }, 0);
}
