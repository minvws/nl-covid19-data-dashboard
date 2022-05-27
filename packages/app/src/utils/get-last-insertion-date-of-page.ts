import { get } from 'lodash';
/**
 * This method gets the most recent insertion date from the metrics used in a page
 *
 */

export function getLastInsertionDateOfPage(
  data: unknown,
  pageMetrics: string[]
) {
  return pageMetrics.reduce((lastDate, metricProperty) => {
    const metricOrUnixDate = get(data, metricProperty);

    // TODO: extract all cases in seperate function. 1. date, 2. last_values, 3. values

    const metricDate =
      typeof metricOrUnixDate === 'number'
        ? metricOrUnixDate
        : metricOrUnixDate?.last_value?.date_of_insertion_unix || metricOrUnixDate?.values.reduce((max: number, value: any) => value?.date_of_insertion_unix > max ? value.date_of_insertion_unix : max, 0) || 0;

    return metricDate > lastDate ? metricDate : lastDate;
  }, 0);
}
