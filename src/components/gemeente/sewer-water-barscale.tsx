import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { SewerWaterBarScaleData } from '~/utils/sewer-water/municipality-sewer-water.util';

const text = siteText.gemeente_rioolwater_metingen;

export function SewerWaterBarScale(props: {
  data: SewerWaterBarScaleData | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return <p>{siteText.no_data_for_this_municipality.text}</p>;

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
