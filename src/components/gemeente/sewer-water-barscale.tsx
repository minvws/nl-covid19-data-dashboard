import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { BarScale } from '~/components/barScale';
import { SewerWaterBarScaleData } from '~/utils/sewer-water/municipality-sewer-water.util';

export function SewerWaterBarScale(props: {
  data: SewerWaterBarScaleData | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;
  const { siteText }: ILocale = useContext(LocaleContext);

  if (!data) return <p>{siteText.no_data_for_this_municipality.text}</p>;

  return (
    <BarScale
      min={0}
      max={100}
      textKey="gemeente_rioolwater_metingen"
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
