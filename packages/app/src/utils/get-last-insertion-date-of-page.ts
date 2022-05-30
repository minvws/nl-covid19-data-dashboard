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

    let metricDate: number;

    if (typeof metricOrUnixDate === 'number') {
      metricDate = metricOrUnixDate;
    } else if (typeof metricOrUnixDate?.last_value?.date_of_insertion_unix !== 'undefined') {
      metricDate = metricOrUnixDate?.last_value?.date_of_insertion_unix;
    } else if (typeof metricOrUnixDate?.values !== 'undefined') {
      metricDate = metricOrUnixDate?.values.reduce((max: number, value: any) => value.date_of_insertion_unix > max ? value.date_of_insertion_unix : max, 0);
    } else {
      metricDate = 0;
    }

    return metricDate > lastDate ? metricDate : lastDate;
  }, 0);
}
