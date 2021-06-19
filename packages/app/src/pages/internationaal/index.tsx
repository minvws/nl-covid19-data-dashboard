import Head from 'next/head';
import { EuropeChoropleth } from '~/components/choropleth/europe-choropleth';
import { addCountryNameToChoroplethData } from '~/domain/internationaal/logic/add-country-name-to-choropleth-data';
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
export interface International {
  last_generated: string;
  proto_name: 'INTL_COLLECTION';
  name: string;
  code: string;
  test: TestData[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    intl: ({ test }) => addCountryNameToChoroplethData(test, 'cncode'),
  })
);

const AccessibilityPage = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, choropleth } = props;
  const { intl } = choropleth;

  const reverseRouter = useReverseRouter();

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
          data={intl}
          metricProperty="infected_per_100k"
          joinProperty="cncode"
          getLink={reverseRouter.vr.positiefGetesteMensen}
          tooltipContent={(context) => (
            <div>
              {context.countryName}: {context.infected_per_100k}
            </div>
          )}
        />
      </Content>
    </Layout>
  );
};

export default AccessibilityPage;
