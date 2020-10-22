import { ResultsPerRegion } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

import siteText from '~/locale/index';

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
      'relative'
    ),
  });

  return (
    <MetricKPI
      title={title}
      value={data.last_value.hospital_increase_per_region}
      format={formatNumber}
      description={description}
    />
  );
}
