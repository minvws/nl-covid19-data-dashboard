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

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      Number(data.dateInsertedUnix),
      'relative'
    ),
  });

  return (
    <MetricKPI
      title={title}
      value={data.value}
      format={formatNumber}
      description={description}
    />
  );
}
