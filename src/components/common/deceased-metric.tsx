import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { NationalDeceasedRivmValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;

interface DeceasedMetricProps {
  title: string;
  data: NationalDeceasedRivmValue;
}

export function DeceasedMetric({ data, title }: DeceasedMetricProps) {
  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_of_report_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.covid_daily)}
      description={description}
    />
  );
}
