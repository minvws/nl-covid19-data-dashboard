import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { NationalElderlyAtHomeValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;

interface ElderlyAtHomeMetricProps {
  data: NationalElderlyAtHomeValue;
  title: string;
}

export function ElderlyAtHomeMetric({ data, title }: ElderlyAtHomeMetricProps) {
  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_of_report_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.positive_tested_daily)}
      description={description}
    />
  );
}
