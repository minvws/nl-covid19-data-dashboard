import BarScale from '~/components/barScale';
import { VerdenkingenHuisartsen } from '~/types/data.d';

import siteText from '~/locale/index';
const text: typeof siteText.verdenkingen_huisartsen =
  siteText.verdenkingen_huisartsen;

export function SuspectedPatientsBarScale(props: {
  data: VerdenkingenHuisartsen | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={140}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.incidentie as number | null}
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
