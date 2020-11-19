import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { IntakeIntensivecareMaLastValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.ic_opnames_per_dag.titel_kpi;

export function IntakeIntensiveCareMetric(props: {
  data: IntakeIntensivecareMaLastValue | undefined;
}) {
  const { data } = props;

  if (data === undefined) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_of_report_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.moving_average_ic)}
      description={description}
    />
  );
}
