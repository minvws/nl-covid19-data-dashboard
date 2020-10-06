import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';

const text = siteText.verpleeghuis_positief_geteste_personen;

export function NursingHomeInfectedPeopleBarScale(props: {
  value: number;
  showAxis: boolean;
}) {
  const { value, showAxis } = props;

  if (!value) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.barscale_screenreader_text}
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
