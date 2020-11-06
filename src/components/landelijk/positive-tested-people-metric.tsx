import { NationalInfectedPeopleTotalValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.positief_geteste_personen.titel_kpi;

export function PositiveTestedPeopleMetric(props: {
  data: NationalInfectedPeopleTotalValue | undefined;
}) {
  const { data } = props;

  if (data === undefined) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data?.date_of_report_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      value={data.infected_daily_total}
      format={formatNumber}
      description={description}
    />
  );
}
