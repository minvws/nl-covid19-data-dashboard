import { MetricKPI } from '~/components/metricKPI';
import { HospitalAdmissionsLastValue } from '~/types/data.d';
import { formatNumber } from '~/utils/formatNumber';

export function IntakeHospitalMetric(props: {
  data: HospitalAdmissionsLastValue | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

  return (
    <MetricKPI
      textKey="gemeente_ziekenhuisopnames_per_dag"
      value={data.moving_average_hospital}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
