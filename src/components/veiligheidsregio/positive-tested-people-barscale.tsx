import { BarScale } from '~/components/barScale';
import { ResultsPerRegion } from '~/types/data.d';

export function PositivelyTestedPeopleBarScale(props: {
  data: ResultsPerRegion | undefined;
  showAxis: boolean;
  showValue?: boolean;
}) {
  const { data, showAxis, showValue } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      textKey="veiligheidsregio_positief_geteste_personen"
      value={data.last_value.infected_increase_per_region}
      id="positief"
      rangeKey="infected_daily_increase"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 7,
        },
        {
          color: '#f35065',
          value: 10,
        },
      ]}
      signaalwaarde={7}
      showAxis={showAxis}
      showValue={showValue}
    />
  );
}
