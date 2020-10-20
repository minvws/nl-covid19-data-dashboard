import { HospitalAdmissionsLastValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.gemeente_ziekenhuisopnames_per_dag.barscale_titel;

export function IntakeHospitalMetric(props: {
  data: HospitalAdmissionsLastValue | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data?.date_of_report_unix, 'relative'),
  });

  return (
    <MetricKPI
      title={title}
      value={data.moving_average_hospital}
      format={formatNumber}
      description={description}
    />
  );
}
