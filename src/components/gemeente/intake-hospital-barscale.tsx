import { BarScale } from '~/components/barScale';
import { HospitalAdmissions } from '~/types/data.d';

export function IntakeHospitalBarScale(props: {
  data: HospitalAdmissions | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      textKey="gemeente_ziekenhuisopnames_per_dag"
      value={data.last_value.moving_average_hospital}
      id="opnames"
      rangeKey="moving_average_hospital"
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
