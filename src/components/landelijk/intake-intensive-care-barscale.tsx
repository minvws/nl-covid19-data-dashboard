import { DifferenceIndicator } from '~/components-styled/difference-indicator';
import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { National } from '~/types/data.d';

const text = siteText.ic_opnames_per_dag;

export function IntakeIntensiveCareBarscale(props: {
  data: National;
  showAxis: boolean;
  showValue?: boolean;
}) {
  const { data, showAxis, showValue } = props;

  const lastValue = data.intake_intensivecare_ma.last_value;
  const difference = data.difference.intake_intensivecare_ma__moving_average_ic;

  return (
    <>
      <BarScale
        min={0}
        max={30}
        gradient={[
          {
            color: '#69c253',
            value: 0,
          },
          {
            color: '#D3A500',
            value: 10,
          },
          {
            color: '#f35065',
            value: 20,
          },
        ]}
        rangeKey="moving_average_ic"
        screenReaderText={text.barscale_screenreader_text}
        signaalwaarde={10}
        value={lastValue.moving_average_ic}
        id="ic"
        showAxis={showAxis}
        showValue={showValue}
      />
      {showValue && <DifferenceIndicator value={difference} isDecimal />}
    </>
  );
}
