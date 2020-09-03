import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';

import siteText from 'locale';

import { InfectedPeopleDeltaNormalized } from 'types/data';
import SafetyRegionMap from 'components/mapChart/SafetyRegionMap';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const vrcode = router.query.code as string;

  return (
    <article className="metric-article layout-two-column">
      <div className="column-item column-item-extra-margin">
        <h3>{text.map_titel}</h3>
        <p>{text.map_toelichting}</p>
      </div>

      <div className="column-item column-item-extra-margin">
        <SafetyRegionMap
          selected={vrcode ? { id: vrcode } : undefined}
          metric="positive_tested_people"
          gradient={['#9DDEFE', '#0290D6']}
        />
      </div>
    </article>
  );
};

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export default PostivelyTestedPeople;
