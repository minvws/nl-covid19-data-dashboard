import { MetricKPI } from '~/components/metricKPI';
import { InfectiousPeopleLastKnownAverageValue } from '~/types/data.d';
import { formatNumber } from '~/utils/formatNumber';

export function InfectiousPeopleMetric(props: {
  data: InfectiousPeopleLastKnownAverageValue | undefined;
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
      textKey="besmettelijke_personen"
      value={data.infectious_avg}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
