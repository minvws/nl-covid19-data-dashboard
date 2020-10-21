import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { InfectedPeopleDeltaNormalized } from '~/types/data.d';

const text = siteText.positief_geteste_personen;

export function PositiveTestedPeopleBarScale(props: {
  data: InfectedPeopleDeltaNormalized | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infected_daily_increase}
      id="positief"
      rangeKey="infected_daily_increase"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 7,
        },
        {
          color: '#f35065',
          value: 10,
        },
      ]}
      signaalwaarde={7}
      showAxis={showAxis}
    />
  );
}
