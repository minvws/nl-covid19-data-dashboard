import { NationalNursingHomeValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function NursingHomeInfectedPeopleMetric(props: {
  data: NationalNursingHomeValue | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

  return (
    <MetricKPI
      textKey="verpleeghuis_positief_geteste_personen"
      value={data.newly_infected_people}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
