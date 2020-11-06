import { BarScale } from '~/components/barScale';
import { InfectiousPeopleLastKnownAverageValue } from '~/types/data.d';

export function InfectiousPeopleBarScale(props: {
  data: InfectiousPeopleLastKnownAverageValue | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={80}
      textKey="besmettelijke_personen"
      value={data.infectious_avg}
      id="besmettelijk"
      rangeKey="infectious_normalized_high"
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
