import Head from 'next/head';
import { EuropeChoropleth } from '~/components/choropleth/europe-choropleth';
import { addCountryNameToChoroplethData } from '~/domain/internationaal/logic/add-country-name-to-choropleth-data';
import { useAnimatedData } from '~/domain/internationaal/logic/use-animated-data';
import { Content } from '~/domain/layout/content';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { useReverseRouter } from '~/utils/use-reverse-router';

type TestData = {
  date_unix: number;
  cncode: string;
  infected_per_100k: number;
  date_of_insertion_unix: number;
};

type TestData2 = {
  date_unix: number;
  cncode: string;
  infected_per_200k: number;
  date_of_insertion_unix: number;
};

const DAY_IN_SECONDS = 24 * 60 * 60;
export interface International {
  last_generated: string;
  proto_name: 'INTL_COLLECTION';
  name: string;
  code: string;
  tested_overall: TestData[];
  tested_overall2: TestData2[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    intl: ({ tested_overall }) =>
      addCountryNameToChoroplethData(tested_overall, 'cncode'),
  })
);

const startDate = new Date(2020, 2, 22, 0, 0, 0, 0).getTime() / 1000;

const AccessibilityPage = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, choropleth } = props;
  const { intl } = choropleth;
  const reverseRouter = useReverseRouter();

  const [data, play, stop, reset] = useAnimatedData<typeof intl[number]>(
    intl,
    startDate
  );

  return (
    <Layout
      {...siteText.toegankelijkheid_metadata}
      lastGenerated={lastGenerated}
    >
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <Content>
        <EuropeChoropleth
          data={data}
          metricProperty="infected_per_100k"
          joinProperty="cncode"
          getLink={reverseRouter.vr.positiefGetesteMensen}
          tooltipContent={(context) => (
            <div>
              {context.countryName}: {context.infected_per_100k}
            </div>
          )}
        />
        <button onClick={play}>start animating</button>
        <button onClick={stop}>stop animating</button>
        <button onClick={reset}>reset</button>
      </Content>
    </Layout>
  );
};

export default AccessibilityPage;
