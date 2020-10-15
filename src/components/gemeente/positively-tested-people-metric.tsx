import { PositiveTestedPeopleLastValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.gemeente_positief_geteste_personen.barscale_titel;

export function PositivelyTestedPeopleMetric(props: {
  data: PositiveTestedPeopleLastValue | undefined;
}) {
  const { data } = props;

  const description = data?.date_of_report_unix
    ? replaceVariablesInText(text.dateOfReport, {
        dateOfReport: formatDateFromSeconds(
          data?.date_of_report_unix,
          'relative'
        ),
      })
    : undefined;

  if (!data) return null;

  return (
    <MetricKPI
      label={title}
      value={data.infected_daily_increase}
      format={formatNumber}
      description={description}
    />
  );
}
