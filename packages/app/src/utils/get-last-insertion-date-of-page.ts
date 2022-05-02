/**
 * This method gets the most recent insertion date from the metrics used in a page
 *
 */

export function getLastInsertionDateOfPage(data: any, pageMetrics: string[]) {
  let lastDate = 0;

  pageMetrics.forEach((metric:any) => {
    const metricDate = data[metric]?.last_value?.date_of_insertion_unix;

    if (metricDate) {
      lastDate = metricDate > lastDate ? metricDate : lastDate;
    }
  });
  return lastDate;
}