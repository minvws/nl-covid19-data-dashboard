import { BarScale } from '~/components/barScale';
import { SewerWaterBarScaleData } from '~/utils/sewer-water/safety-region-sewer-water.util';
import siteText from '~/locale/index';

export function SewerWaterBarScale(props: {
  data: SewerWaterBarScaleData;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  const text = siteText.veiligheidsregio_rioolwater_metingen;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.screen_reader_graph_content}
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
