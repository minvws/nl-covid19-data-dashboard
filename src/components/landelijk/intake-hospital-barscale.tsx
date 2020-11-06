import { BarScale } from '~/components/barScale';
import { IntakeHospitalMa } from '~/types/data.d';

export function IntakeHospitalBarScale(props: {
  data: IntakeHospitalMa | undefined;
  showAxis: boolean;
  showValue?: boolean;
}) {
  const { data, showAxis, showValue } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      signaalwaarde={40}
      textKey="ziekenhuisopnames_per_dag"
      value={data.last_value.moving_average_hospital}
      id="opnames"
      rangeKey="moving_average_hospital"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 40,
        },
        {
          color: '#f35065',
          value: 90,
        },
      ]}
      showAxis={showAxis}
      showValue={showValue}
    />
  );
}
