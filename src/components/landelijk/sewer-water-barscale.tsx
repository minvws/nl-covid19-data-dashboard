import { BarScale } from '~/components/barScale';
import { NationalSewer } from '~/types/data.d';

export function SewerWaterBarScale(props: {
  data: NationalSewer;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  return (
    <BarScale
      min={0}
      max={100}
      textKey="rioolwater_metingen"
      value={Number(data.last_value.average)}
      id="rioolwater_metingen"
      rangeKey="average"
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
