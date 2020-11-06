import { MetricKPI } from '~/components/metricKPI';
import siteText from '~/locale/index';
import { NationalSewer } from '~/types/data.d';
import { formatNumber } from '~/utils/formatNumber';

export function SewerWaterMetric(props: { data: NationalSewer }) {
  const { data } = props;
  if (data === undefined) return null;

  return (
    <MetricKPI
      title={title}
      value={data.last_value.average}
      format={formatNumber}
      descriptionDate={data?.last_value.date_of_insertion_unix}
      valueAnnotation={siteText.waarde_annotaties.riool_normalized}
    />
  );
}
