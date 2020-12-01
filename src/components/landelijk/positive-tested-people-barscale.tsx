import { Box } from '~/components-styled/base';
import { DifferenceIndicator } from '~/components-styled/difference-indicator';
import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { National } from '~/types/data.d';

const text = siteText.positief_geteste_personen;

export function PositiveTestedPeopleBarScale(props: {
  data: National;
  showAxis: boolean;
  showValue?: boolean;
}) {
  const { data, showAxis, showValue } = props;

  if (!data.infected_people_delta_normalized) return null;

  const lastValue = data.infected_people_delta_normalized.last_value;
  const difference =
    data.difference.infected_people_delta_normalized__infected_daily_increase;

  return (
    <Box spacing={2}>
      <BarScale
        min={0}
        max={10}
        screenReaderText={text.barscale_screenreader_text}
        value={lastValue.infected_daily_increase}
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
        showValue={showValue}
      />
      {showValue && difference && <DifferenceIndicator value={difference} />}
    </Box>
  );
}
