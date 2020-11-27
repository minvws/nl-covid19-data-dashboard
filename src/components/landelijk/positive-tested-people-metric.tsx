import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { National } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.positief_geteste_personen.titel_kpi;

export function PositiveTestedPeopleMetric({ data }: { data: National }) {
  const lastValue = data.infected_people_total.last_value;
  const difference =
    data.difference.infected_people_total__infected_daily_total;

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
