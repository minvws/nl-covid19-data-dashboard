import { DifferenceIndicator } from '~/components-styled/difference-indicator';
import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { National } from '~/types/data.d';

const text = siteText.ziekenhuisopnames_per_dag;

export function IntakeHospitalBarScale(props: {
  data: National;
  showAxis: boolean;
  showValue?: boolean;
}) {
  const { data, showAxis, showValue } = props;

  const lastValue = data.intake_hospital_ma.last_value;
  const difference =
    data.difference.intake_hospital_ma__moving_average_hospital;

  return (
    <>
      <BarScale
        min={0}
        max={100}
        signaalwaarde={40}
        screenReaderText={text.barscale_screenreader_text}
        value={lastValue.moving_average_hospital}
        id="opnames"
        rangeKey="moving_average_hospital"
        gradient={[
          {
            color: '#69c253',
            value: 0,
          },
          {
            color: '#D3A500',
            value: 40,
          },
          {
            color: '#f35065',
            value: 90,
          },
        ]}
        showAxis={showAxis}
        showValue={showValue}
      />
      {
        /**
         * A bit of a hack to re-use showValue for this, but this component needs
         * better abstraction anyway so prefer to pick this up later
         */
        showValue && <DifferenceIndicator value={difference} />
      }
    </>
  );
}
