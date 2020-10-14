import { BarScale } from '~/components/barScale';
import { PositiveTestedPeople } from '~/types/data.d';

import siteText from '~/locale/index';
const text = siteText.gemeente_positief_geteste_personen;

export function PositivelyTestedPeopleBarScale(props: {
  data: PositiveTestedPeople | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.screen_reader_graph_content}
      value={data.last_value.infected_daily_increase}
      id="positief"
      rangeKey="infected_daily_increase"
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
