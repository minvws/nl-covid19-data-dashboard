import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { Regionaal } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.veiligheidsregio_ziekenhuisopnames_per_dag.titel_kpi;

export function IntakeHospitalMetric({ data }: { data: Regionaal }) {
  const lastValue = data.results_per_region.last_value;
  const difference =
    data.difference.results_per_region__hospital_moving_avg_per_region;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      lastValue.date_of_report_unix,
      'medium'
    ),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(lastValue.hospital_moving_avg_per_region)}
      description={description}
      difference={difference}
    />
  );
}
