import { BarScale } from '~/components/barScale';

export function NursingHomeDeathsBarScale(props: {
  value: number | undefined;
  showAxis: boolean;
}) {
  const { value, showAxis } = props;

  if (value === undefined) return null;

  return (
    <BarScale
      min={0}
      max={50}
      textKey="verpleeghuis_oversterfte"
      value={value}
      id="over"
      rangeKey="deceased_nursery_daily"
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
