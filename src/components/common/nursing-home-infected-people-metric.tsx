import { NationalNursingHomeValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';
import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.verpleeghuis_positief_geteste_personen.titel;

export function NursingHomeInfectedPeopleMetric(props: {
  data: NationalNursingHomeValue;
}) {
  const { data } = props;

  const description = data?.date_of_report_unix
    ? replaceVariablesInText(text.dateOfReport, {
        dateOfReport: formatDateFromSeconds(
          data.date_of_report_unix,
          'relative'
        ),
      })
    : undefined;

  if (!data) return null;

  return (
    <MetricKPI
      title={title}
      value={data.newly_infected_people}
      format={formatNumber}
      description={description}
    />
  );
}
