import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { NationalSewer } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.rioolwater_metingen.kpi_titel;

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
      absolute={formatNumber(data.last_value.average)}
      description={description}
      valueAnnotation={siteText.waarde_annotaties.riool_normalized}
    />
  );
}
