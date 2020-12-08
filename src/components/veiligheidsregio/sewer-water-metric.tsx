import { MetricKPI } from '~/components-styled/metric-kpi';
import siteText from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { SewerWaterBarScaleData } from '~/utils/sewer-water/safety-region-sewer-water.util';

const text = siteText.common.metricKPI;
const title = siteText.veiligheidsregio_rioolwater_metingen.kpi_titel;

export function SewerWaterMetric(props: { data: SewerWaterBarScaleData }) {
  const { data } = props;

  const description =
    data.week_start_unix && data.week_end_unix
      ? replaceVariablesInText(text.dateRangeOfReport, {
          startDate: formatDateFromSeconds(data.week_start_unix, 'axis'),
          endDate: formatDateFromSeconds(data.week_end_unix, 'axis'),
        })
      : undefined;

  return (
    <MetricKPI
      title={title}
      absolute={formatNumber(data.value)}
      description={description}
      valueAnnotation={siteText.waarde_annotaties.riool_normalized}
    />
  );
}
