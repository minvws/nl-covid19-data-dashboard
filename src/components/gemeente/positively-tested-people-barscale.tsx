import { BarScale } from '~/components/barScale';
import { PositiveTestedPeople } from '~/types/data.d';

export function PositivelyTestedPeopleBarScale(props: {
  data: PositiveTestedPeople | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      textKey="gemeente_positief_geteste_personen"
      value={data.last_value.infected_daily_increase}
      id="positief"
      rangeKey="infected_daily_increase"
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
