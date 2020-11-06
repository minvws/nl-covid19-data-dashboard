import { BarScale } from '~/components/barScale';
import { SewerWaterBarScaleData } from '~/utils/sewer-water/safety-region-sewer-water.util';

export function SewerWaterBarScale(props: {
  data: SewerWaterBarScaleData;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  return (
    <BarScale
      min={0}
      max={100}
      textKey="veiligheidsregio_rioolwater_metingen"
      value={Number(data.value)}
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
