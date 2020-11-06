import { IntakeHospitalMaLastValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function IntakeHospitalMetric(props: {
  data: IntakeHospitalMaLastValue | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

<<<<<<< HEAD
  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_of_report_unix, 'medium'),
  });

=======
>>>>>>> update all metrics to use context
  return (
    <MetricKPI
      textKey="ziekenhuisopnames_per_dag"
      value={data.moving_average_hospital}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
