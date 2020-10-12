import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';

const text = siteText.verpleeghuis_oversterfte;

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
      screenReaderText={text.barscale_screenreader_text}
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
