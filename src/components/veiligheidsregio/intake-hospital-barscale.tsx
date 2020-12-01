import { BarScale } from '~/components/barScale';
import { Regionaal } from '~/types/data.d';
import siteText from '~/locale/index';

export function IntakeHospitalBarScale(props: {
  data: Regionaal;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;
  const lastValue = data.results_per_region.last_value;

  const text = siteText.veiligheidsregio_ziekenhuisopnames_per_dag;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.barscale_screenreader_text}
      value={lastValue.hospital_moving_avg_per_region}
      id="opnames"
      rangeKey="hospital_moving_avg_per_region"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
      showAxis={showAxis}
    />
  );
}
