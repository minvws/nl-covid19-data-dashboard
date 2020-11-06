import { MetricKPI } from '~/components/metricKPI';
import siteText from '~/locale/index';
import { NationalHuisartsVerdenkingenValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.verdenkingen_huisartsen.titel_kpi;

export function SuspectedPatientsMetric(props: {
  data: NationalHuisartsVerdenkingenValue | undefined;
}) {
  const { data } = props;

  if (data === undefined) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.week_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      value={Number(data.geschat_aantal)}
      format={formatNumber}
      description={description}
    />
  );
}
