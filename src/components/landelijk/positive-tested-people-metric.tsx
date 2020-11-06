import { NationalInfectedPeopleTotalValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function PositiveTestedPeopleMetric(props: {
  data: NationalInfectedPeopleTotalValue | undefined;
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
      textKey="positief_geteste_personen"
      value={data.infected_daily_total}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
