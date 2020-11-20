import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { RegionaalValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.gemeente_positief_geteste_personen.titel_kpi;

export function PositivelyTestedPeopleMetric(props: {
  data: RegionaalValue | undefined;
}) {
  const { data } = props;

  if (data === undefined) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_of_report_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.total_reported_increase_per_region)}
      description={description}
    />
  );
}
