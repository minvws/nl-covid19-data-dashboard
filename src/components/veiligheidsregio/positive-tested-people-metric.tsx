import { RegionaalValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function PositivelyTestedPeopleMetric(props: {
  data: RegionaalValue | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

  return (
    <MetricKPI
      textKey="gemeente_positief_geteste_personen"
      value={data.total_reported_increase_per_region}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
