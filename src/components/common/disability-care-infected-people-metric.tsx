import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { NationalDisabilityCareValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.gehandicaptenzorg_positief_geteste_personen.kpi_titel;

export function DisabilityCareInfectedPeopleMetric(props: {
  data: NationalDisabilityCareValue | undefined;
}) {
  const { data } = props;

  if (data === undefined) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_of_report_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.newly_infected_people)}
      description={description}
    />
  );
}
