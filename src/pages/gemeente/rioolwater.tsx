import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';

import siteText from 'locale';

import { RioolwaterMetingen } from 'types/data';

const text: typeof siteText.rioolwater_metingen = siteText.rioolwater_metingen;

export function SewerWaterBarScale(props: {
  data: RioolwaterMetingen | undefined;
}) {
  const { data } = props;

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
    />
  );
}

const SewerWater: FCWithLayout = () => {
  return null;
};

SewerWater.getLayout = getMunicipalityLayout();

export default SewerWater;
