import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { NationalSewer } from '~/types/data.d';

const text = siteText.rioolwater_metingen;

export function SewerWaterBarScale(props: {
  data: NationalSewer;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.barscale_screenreader_text}
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
