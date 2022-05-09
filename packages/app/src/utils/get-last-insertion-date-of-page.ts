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

    const metricDate =
      typeof metricOrUnixDate === 'number'
        ? metricOrUnixDate
        : metricOrUnixDate?.last_value?.date_of_insertion_unix || 0;

    return metricDate > lastDate ? metricDate : lastDate;
  }, 0);
}
