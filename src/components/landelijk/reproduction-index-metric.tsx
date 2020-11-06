import { ReproductionIndexLastKnownAverageLastValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function ReproductionIndexMetric(props: {
  data: ReproductionIndexLastKnownAverageLastValue | undefined;
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
      textKey="reproductiegetal"
      value={data.reproduction_index_avg}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
