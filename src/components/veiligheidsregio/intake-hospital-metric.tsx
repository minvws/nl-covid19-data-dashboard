import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { ResultsPerRegion } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.veiligheidsregio_ziekenhuisopnames_per_dag.titel_kpi;

export function IntakeHospitalMetric(props: {
  data: ResultsPerRegion | undefined;
}) {
  const { data } = props;

  if (data === undefined) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      data?.last_value.date_of_report_unix,
      'medium'
    ),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.last_value.hospital_moving_avg_per_region)}
      description={description}
    />
  );
}
