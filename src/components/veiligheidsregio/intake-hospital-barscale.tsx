import { BarScale } from '~/components/barScale';
import { ResultsPerRegion } from '~/types/data.d';

export function IntakeHospitalBarScale(props: {
  data: ResultsPerRegion | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      textKey="verdenkingen_huisartsen"
      value={data.last_value.hospital_moving_avg_per_region}
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
