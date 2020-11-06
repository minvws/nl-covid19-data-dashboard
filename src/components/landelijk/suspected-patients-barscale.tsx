import { BarScale } from '~/components/barScale';
import { NationalHuisartsVerdenkingen } from '~/types/data.d';

export function SuspectedPatientsBarScale(props: {
  data: NationalHuisartsVerdenkingen | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={140}
      textKey="verdenkingen_huisartsen"
      value={data.last_value.incidentie}
      id="verdenkingen_huisartsen"
      rangeKey="incidentie"
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
