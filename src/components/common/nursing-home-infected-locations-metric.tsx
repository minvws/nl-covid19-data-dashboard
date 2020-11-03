import { NationalNursingHomeValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';
import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.verpleeghuis_besmette_locaties.titel_kpi;

export function NursingHomeInfectedLocationsMetric(props: {
  data: NationalNursingHomeValue;
}) {
  const { data } = props;

  if (!data) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      data.date_of_insertion_unix,
      'relative'
    ),
  });

  return (
    <MetricKPI
      title={title}
      value={data.infected_locations_total}
      format={formatNumber}
      description={description}
    />
  );
}
