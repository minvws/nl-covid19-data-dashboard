import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { NationalNursingHomeValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.verpleeghuis_besmette_locaties.titel_kpi;

export function NursingHomeInfectedLocationsMetric(props: {
  data: NationalNursingHomeValue;
}) {
  const { data } = props;

  if (!data) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_of_report_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.infected_locations_total)}
      percentage={formatPercentage(data.infected_locations_percentage)}
      description={description}
    />
  );
}
