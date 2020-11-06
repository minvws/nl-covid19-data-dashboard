import { NationalNursingHomeValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';

export function NursingHomeDeathsMetric(props: {
  data: NationalNursingHomeValue | undefined;
}) {
  const { data } = props;
  if (data === undefined) return null;

  return (
    <MetricKPI
      textKey="verpleeghuis_oversterfte"
      value={data.deceased_daily}
      format={formatNumber}
      descriptionDate={data?.date_of_report_unix}
    />
  );
}
