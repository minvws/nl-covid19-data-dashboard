import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';

import siteText from 'locale';

import { InfectedPeopleDeltaNormalized } from 'types/data';

const text: typeof siteText.positief_geteste_personen =
  siteText.positief_geteste_personen;

export function PostivelyTestedPeopleBarScale(props: {
  data: InfectedPeopleDeltaNormalized | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.screen_reader_graph_content}
      value={data.last_value.infected_daily_increase}
      id="positief"
      rangeKey="infected_daily_increase"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const PostivelyTestedPeople: FCWithLayout = () => {
  return null;
};

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export default PostivelyTestedPeople;
