import { BarScale } from '~/components/barScale';

export function NursingHomeInfectedPeopleBarScale(props: {
  value: number;
  showAxis: boolean;
}) {
  const { value, showAxis } = props;

  if (value === undefined) return null;

  return (
    <BarScale
      min={0}
      max={100}
      textKey="verpleeghuis_positief_geteste_personen"
      value={value}
      id="positief_verpleeghuis"
      rangeKey="infected_nursery_daily"
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
