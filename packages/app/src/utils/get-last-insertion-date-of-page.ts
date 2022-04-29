/**
 * This method gets the most recent insertion date from the metrics used in a page
 *
 */

export function getLastInsertionDateOfPage(data: any, pageMetrics: string[]) {
  let lastDate = 0;
  pageMetrics.forEach((metric: any) => {
    const metricDate = typeof data[metric].last_value?.date_of_insertion_unix === undefined ? 0 : data[metric].last_value?.date_of_insertion_unix
    lastDate = metricDate > lastDate ? data[metric].last_value?.date_of_insertion_unix : lastDate
  });
  return lastDate;
}
