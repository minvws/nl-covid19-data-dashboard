import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { National } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.ziekenhuisopnames_per_dag.titel_kpi;

export function IntakeHospitalMetric({ data }: { data: National }) {
  const lastValue = data.intake_hospital_ma.last_value;
  const difference =
    data.difference.intake_hospital_ma__moving_average_hospital;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      lastValue.date_of_report_unix,
      'medium'
    ),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(lastValue.moving_average_hospital)}
      description={description}
      difference={difference}
    />
  );
}
