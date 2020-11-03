import { SewerWaterBarScaleData } from '~/utils/sewer-water/safety-region-sewer-water.util';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.veiligheidsregio_rioolwater_metingen.titel_kpi;

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
      value={data.value}
      format={formatNumber}
      description={description}
      valueAnnotation={siteText.waarde_annotaties.riool_normalized}
    />
  );
}
