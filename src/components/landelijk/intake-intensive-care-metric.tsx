import { IntakeIntensivecareMaLastValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.besmettelijke_personen.title;

export function IntakeIntensiveCareMetric(props: {
  data: IntakeIntensivecareMaLastValue | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data?.date_of_report_unix, 'relative'),
  });

  return (
    <MetricKPI
      title={title}
      value={data.moving_average_ic}
      format={formatNumber}
      description={description}
    />
  );
}
