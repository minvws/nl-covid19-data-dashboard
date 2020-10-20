import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { RioolwaterMetingen } from '~/types/data.d';

const text = siteText.rioolwater_metingen;

export function SewerWaterBarScale(props: {
  data: RioolwaterMetingen | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

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
