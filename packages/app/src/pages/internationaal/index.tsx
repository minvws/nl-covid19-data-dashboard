import Head from 'next/head';
import { ChangeEvent, useState } from 'react';
import { Box } from '~/components/base';
import { EuropeChoropleth } from '~/components/choropleth/europe-choropleth';
import { addCountryNameToChoroplethData } from '~/domain/internationaal/logic/add-country-name-to-choropleth-data';
import { getAnimatedDataDocumentInfo } from '~/domain/internationaal/logic/get-animated-data-document-info';
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
  }),
  () => getAnimatedDataDocumentInfo('json/euro')
);

const AccessibilityPage = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, choropleth, documentCount, firstDocument } = props;
  const { intl } = choropleth;
  const reverseRouter = useReverseRouter();
  const [stepValue, setStepValue] = useState(1);

  const [data, play, skip, stop, reset, loadingState] = useAnimatedData<
    typeof intl[number]
  >(intl, firstDocument, documentCount);

  function loadDate(event: ChangeEvent<HTMLInputElement>) {
    setStepValue(+event.target.value);
    skip(+event.target.value);
  }

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
        <Box>
          <button onClick={play}>start animating</button>
          <button onClick={stop}>stop animating</button>
          <button onClick={reset}>reset</button>
          <input
            type="range"
            min={1}
            max={documentCount}
            onChange={loadDate}
            value={stepValue}
            step={1}
          />
        </Box>
        <Box height={2}>
          {loadingState === 'loading' && <span>Loading...</span>}
        </Box>
      </Content>
    </Layout>
  );
};

export default AccessibilityPage;
