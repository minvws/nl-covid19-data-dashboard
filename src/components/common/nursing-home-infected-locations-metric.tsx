import { TotalReportedLocationsLastValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';
import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.verpleeghuis_positief_geteste_personen.titel;

export function NursingHomeInfectedLocationsMetric(props: {
  data: TotalReportedLocationsLastValue;
}) {
  const { data } = props;

  const description = data?.date_of_insertion_unix
    ? replaceVariablesInText(text.dateOfReport, {
        dateOfReport: formatDateFromSeconds(
          data.date_of_insertion_unix,
          'relative'
        ),
      })
    : undefined;

  if (!data) return null;

  return (
    <MetricKPI
      label={title}
      value={Number(data.total_reported_locations)}
      format={formatNumber}
      description={description}
    />
  );
}
