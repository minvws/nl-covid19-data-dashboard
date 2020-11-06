import { SewerWaterBarScaleData } from '~/utils/sewer-water/municipality-sewer-water.util';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function SewerWaterMetric(props: { data: SewerWaterBarScaleData }) {
  const { data } = props;

  return (
    <MetricKPI
      textKey="gemeente_rioolwater_metingen"
      value={data.value}
      format={formatNumber}
      descriptionDate={Number(data.unix)}
      valueAnnotation={siteText.waarde_annotaties.riool_normalized}
    />
  );
}
