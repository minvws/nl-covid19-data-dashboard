import { MetricKPI } from '~/components/metricKPI';
import siteText from '~/locale/index';
import { InfectiousPeopleLastKnownAverageValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.besmettelijke_personen.title;

export function InfectiousPeopleMetric(props: {
  data: InfectiousPeopleLastKnownAverageValue | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data?.date_of_report_unix, 'relative'),
  });

  return (
    <MetricKPI
      title={title}
      value={data.infectious_avg}
      format={formatNumber}
      description={description}
    />
  );
}
