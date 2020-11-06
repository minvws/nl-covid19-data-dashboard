import { PositiveTestedPeopleLastValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function PositivelyTestedPeopleMetric(props: {
  data: PositiveTestedPeopleLastValue | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

  return (
    <MetricKPI
      textKey="gemeente_positief_geteste_personen"
      value={data.infected_daily_total}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
