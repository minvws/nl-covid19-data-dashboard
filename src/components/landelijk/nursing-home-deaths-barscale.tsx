import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { DeceasedPeopleNurseryCountDaily } from '~/types/data.d';

const text: typeof siteText.verpleeghuis_oversterfte =
  siteText.verpleeghuis_oversterfte;

export function NursingHomeDeathsBarScale(props: {
  data: DeceasedPeopleNurseryCountDaily | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={50}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.deceased_nursery_daily}
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
