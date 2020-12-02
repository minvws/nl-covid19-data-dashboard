import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { NationalElderlyAtHomeValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.thuiswonende_ouderen.titel_kpi;

interface ElderlyAtHomeMetricProps {
  data: NationalElderlyAtHomeValue;
}

export function ElderlyAtHomeMetric({ data }: ElderlyAtHomeMetricProps) {
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
