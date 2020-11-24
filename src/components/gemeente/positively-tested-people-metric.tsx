import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { Municipal } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.gemeente_positief_geteste_personen.titel_kpi;

export function PositivelyTestedPeopleMetric({ data }: { data: Municipal }) {
  const lastValue = data.positive_tested_people.last_value;
  const difference =
    data.difference.positive_tested_people__infected_daily_total;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      lastValue.date_of_report_unix,
      'medium'
    ),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(lastValue.infected_daily_total)}
      description={description}
      difference={difference}
    />
  );
}
