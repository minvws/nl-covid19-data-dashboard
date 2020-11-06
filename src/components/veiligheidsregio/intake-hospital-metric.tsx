import { ResultsPerRegion } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function IntakeHospitalMetric(props: {
  data: ResultsPerRegion | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

  return (
    <MetricKPI
      textKey="veiligheidsregio_ziekenhuisopnames_per_dag"
      value={data.last_value.hospital_moving_avg_per_region}
      format={formatNumber}
      descriptionDate={data?.last_value.date_of_report_unix}
    />
  );
}
