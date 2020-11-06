import { NationalNursingHomeValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function NursingHomeInfectedLocationsMetric(props: {
  data: NationalNursingHomeValue;
}) {
  const { data } = props;
  if (!data) return null;

  return (
    <MetricKPI
      textKey="verpleeghuis_besmette_locaties"
      value={data.infected_locations_total}
      format={formatNumber}
      descriptionDate={data?.date_of_insertion_unix}
    />
  );
}
