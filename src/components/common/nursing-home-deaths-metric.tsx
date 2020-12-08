import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { NationalNursingHomeValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.verpleeghuis_oversterfte.kpi_titel;

export function NursingHomeDeathsMetric(props: {
  data: NationalNursingHomeValue | undefined;
}) {
  const { data } = props;

  if (data === undefined) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_of_report_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.deceased_daily)}
      description={description}
    />
  );
}
