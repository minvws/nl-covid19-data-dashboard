import { NationalHuisartsVerdenkingen } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';
import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.verpleeghuis_positief_geteste_personen.titel;

export function NursingHomeInfectedPeopleMetric(props: {
  data: NationalHuisartsVerdenkingen | undefined;
}) {
  const { data } = props;

  const description = data?.date_of_insertion_unix
    ? replaceVariablesInText(text.dateOfReport, {
        dateOfReport: formatDateFromSeconds(
          data.date_of_insertion_unix,
          'relative'
        ),
      })
    : undefined;

  if (!data) return null;

  return (
    <MetricKPI
      label={title}
      value={Number(data.infected_nursery_daily)}
      format={formatNumber}
      description={description}
    />
  );
}
