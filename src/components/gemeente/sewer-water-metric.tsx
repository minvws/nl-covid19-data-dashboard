import { SewerWaterBarScaleData } from '~/utils/sewer-water/municipality-sewer-water.util';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.gemeente_rioolwater_metingen.barscale_titel;

export function SewerWaterMetric(props: { data: SewerWaterBarScaleData }) {
  const { data } = props;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(Number(data.unix), 'relative'),
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
