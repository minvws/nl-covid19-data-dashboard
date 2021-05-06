import { Regionaal } from '@corona-dashboard/common';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  getVrName,
  loadAndSortVrData,
  selectCustomData,
  selectNlPageMetricData,
} from '~/static-props/get-data';

type ScoreBoardData = Pick<Regionaal, 'escalation_level'> & {
  safetyRegionName: string;
  vrCode: string;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(),
  selectCustomData(() => {
    const scoreboard: ScoreBoardData[] = [];
    for (let i = 1; i <= 25; i++) {
      const vrCode = `VR${i.toString().padStart(2, '0')}`;
      const vrData = loadAndSortVrData(vrCode);
      scoreboard.push({
        escalation_level: vrData.escalation_level,
        safetyRegionName: getVrName(vrCode),
        vrCode,
      });
    }

    return {
      scoreboard,
    };
  })
);

const Scoreboard = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { selectedNlData: data, lastGenerated, scoreboard } = props;

  const text = siteText.rioolwater_metingen;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout
        data={data}
        lastGenerated={lastGenerated}
      ></NationalLayout>
    </Layout>
  );
};

export default Scoreboard;
