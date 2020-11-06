import { BarScale } from '~/components/barScale';

export function NursingHomeInfectedLocationsBarScale(props: {
  value: number | undefined;
  showAxis: boolean;
}) {
  const { value, showAxis } = props;

  if (value === undefined) return null;

  return (
    <BarScale
      min={0}
      max={30}
      textKey="verpleeghuis_besmette_locaties"
      value={value}
      id="besmette_locaties_verpleeghuis"
      rangeKey="total_reported_locations"
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
