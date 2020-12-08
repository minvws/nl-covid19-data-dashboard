import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { Municipal } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.gemeente_ziekenhuisopnames_per_dag.kpi_titel;

export function IntakeHospitalMetric({ data }: { data: Municipal }) {
  const lastValue = data.hospital_admissions?.last_value;
  const difference =
    data.difference.hospital_admissions__moving_average_hospital;

  if (!lastValue) {
    return null;
  }

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
