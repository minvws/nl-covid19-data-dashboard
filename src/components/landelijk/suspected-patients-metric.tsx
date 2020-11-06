import { MetricKPI } from '~/components/metricKPI';
import { NationalHuisartsVerdenkingenValue } from '~/types/data.d';
import { formatNumber } from '~/utils/formatNumber';

export function SuspectedPatientsMetric(props: {
  data: NationalHuisartsVerdenkingenValue | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

<<<<<<< HEAD
  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.week_unix, 'medium'),
  });

=======
>>>>>>> update all metrics to use context
  return (
    <MetricKPI
      textKey="verdenkingen_huisartsen"
      value={Number(data.geschat_aantal)}
      format={formatNumber}
      descriptionDate={data?.date_of_insertion_unix}
    />
  );
}
