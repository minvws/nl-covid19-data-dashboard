import { BarScale } from '~/components/barScale';

import { ReproductionIndex as ReproductionIndexData } from '~/types/data.d';

import siteText from '~/locale/index';
const text = siteText.reproductiegetal;

export function ReproductionIndexBarScale(props: {
  data: ReproductionIndexData | undefined;
  lastKnown: ReproductionIndexData | undefined;
  showAxis: boolean;
}) {
  const { data, lastKnown, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={2}
      screenReaderText={text.barscale_screenreader_text}
      signaalwaarde={1}
      value={lastKnown?.last_value?.reproduction_index_avg}
      id="repro"
      rangeKey="reproduction_index_avg"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#69c253',
          value: 1,
        },
        {
          color: '#D3A500',
          value: 1.0104,
        },
        {
          color: '#f35065',
          value: 1.125,
        },
      ]}
      showAxis={showAxis}
    />
  );
}
