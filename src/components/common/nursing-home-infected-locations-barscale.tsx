import { BarScale } from '~/components/barScale';

import siteText from '~/locale/index';

const text = siteText.verpleeghuis_besmette_locaties;

export function NursingHomeInfectedLocationsBarScale(props: {
  value: number | undefined;
  showAxis: boolean;
}) {
  const { value, showAxis } = props;

  if (!value) return null;

  return (
    <BarScale
      min={0}
      max={30}
      screenReaderText={text.barscale_screenreader_text}
      value={value}
      id="besmette_locaties_verpleeghuis"
      rangeKey="total_reported_locations"
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
