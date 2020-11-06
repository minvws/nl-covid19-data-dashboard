import { IntakeIntensivecareMaLastValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function IntakeIntensiveCareMetric(props: {
  data: IntakeIntensivecareMaLastValue | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

  return (
    <MetricKPI
      textKey="ic_opnames_per_dag"
      value={data.moving_average_ic}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
