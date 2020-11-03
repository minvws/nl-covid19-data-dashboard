import { MetricKPI } from '~/components/metricKPI';
import siteText from '~/locale/index';
import { NationalSewer } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.rioolwater_metingen.titel_kpi;

export function SewerWaterMetric(props: { data: NationalSewer }) {
  const { data } = props;

  if (data === undefined) return null;

  const description = replaceVariablesInText(text.dateRangeOfReport, {
    startDate: formatDateFromSeconds(data.last_value.week_start_unix, 'axis'),
    endDate: formatDateFromSeconds(data.last_value.week_end_unix, 'axis'),
  });

  return (
    <MetricKPI
      title={title}
      value={data.last_value.average}
      format={formatNumber}
      description={description}
    />
  );
}
