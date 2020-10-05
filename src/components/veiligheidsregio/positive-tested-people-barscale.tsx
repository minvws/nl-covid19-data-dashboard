import { BarScale } from '~/components/barScale';
import { ResultsPerRegion } from '~/types/data.d';
import siteText from '~/locale/index';

export function PositivelyTestedPeopleBarScale(props: {
  data: ResultsPerRegion | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  const text = siteText.veiligheidsregio_positief_geteste_personen;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infected_increase_per_region}
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
