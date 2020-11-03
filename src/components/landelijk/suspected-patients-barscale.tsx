import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { NationalHuisartsVerdenkingen } from '~/types/data.d';

const text = siteText.verdenkingen_huisartsen;

export function SuspectedPatientsBarScale(props: {
  data: NationalHuisartsVerdenkingen | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={140}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.incidentie}
      id="verdenkingen_huisartsen"
      rangeKey="incidentie"
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
