import { BarScale } from '~/components/barScale';
import { InfectedPeopleNurseryCountDaily } from '~/types/data.d';
import siteText from '~/locale/index';

const text: typeof siteText.verpleeghuis_positief_geteste_personen =
  siteText.verpleeghuis_positief_geteste_personen;

export function NursingHomeInfectedPeopleBarScale(props: {
  data: InfectedPeopleNurseryCountDaily | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infected_nursery_daily}
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
