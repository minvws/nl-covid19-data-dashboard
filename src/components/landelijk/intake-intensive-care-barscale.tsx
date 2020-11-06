import { BarScale } from '~/components/barScale';
import { IntakeIntensivecareMa } from '~/types/data.d';

export function IntakeIntensiveCareBarscale(props: {
  data: IntakeIntensivecareMa | undefined;
  showAxis: boolean;
  showValue?: boolean;
}) {
  const { data, showAxis, showValue } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={30}
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 10,
        },
        {
          color: '#f35065',
          value: 20,
        },
      ]}
      rangeKey="moving_average_ic"
      textKey="ic_opnames_per_dag"
      signaalwaarde={10}
      value={data.last_value.moving_average_ic}
      id="ic"
      showAxis={showAxis}
      showValue={showValue}
    />
  );
}
