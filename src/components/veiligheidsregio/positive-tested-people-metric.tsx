import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { Regionaal } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.gemeente_positief_geteste_personen.titel_kpi;

export function PositivelyTestedPeopleMetric({ data }: { data: Regionaal }) {
  const lastValue = data.results_per_region.last_value;
  const difference =
    data.difference.results_per_region__total_reported_increase_per_region;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      lastValue.date_of_report_unix,
      'medium'
    ),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(lastValue.total_reported_increase_per_region)}
      description={description}
      difference={difference}
    />
  );
}
