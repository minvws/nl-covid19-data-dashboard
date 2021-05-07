import { isDefined } from 'ts-is-present';
import { vrData } from '~/data/vr';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { Scoreboard, ScoreBoardData } from '~/domain/risiconiveaus/scoreboard';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  loadAndSortVrData,
  selectData,
  selectNlPageMetricData,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(),
  selectData(() => {
    const scoreboardData = vrData
      .reduce<ScoreBoardData[]>(
        (sbData, vr) => {
          const vrData = loadAndSortVrData(vr.code);
          const index = vrData.escalation_level.level - 1;

          sbData[index].vrData.push({
            data: vrData.escalation_level,
            safetyRegionName: vr.name,
            vrCode: vr.code,
          });

          return sbData;
        },
        [1, 2, 3, 4].map<ScoreBoardData>((x) => ({
          escalatationLevel: x as 1 | 2 | 3 | 4,
          vrData: [],
        }))
      )
      .filter(isDefined);

    return {
      scoreboardData,
    };
  })
);

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { selectedNlData: data, lastGenerated, scoreboardData } = props;

  const text = siteText.rioolwater_metingen;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <Scoreboard data={scoreboardData} />
      </NationalLayout>
    </Layout>
  );
};

export default OverRisicoNiveaus;
