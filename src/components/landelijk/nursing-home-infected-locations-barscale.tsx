import { BarScale } from '~/components/barScale';

import { TotalReportedLocations } from '~/types/data.d';

import siteText from '~/locale/index';

const text: typeof siteText.verpleeghuis_besmette_locaties =
  siteText.verpleeghuis_besmette_locaties;

export function NursingHomeInfectedLocationsBarScale(props: {
  data: TotalReportedLocations | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={30}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.total_reported_locations}
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
