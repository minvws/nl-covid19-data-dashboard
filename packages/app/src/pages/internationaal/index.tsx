import Head from 'next/head';
import { ChangeEvent, useState } from 'react';
import { Box } from '~/components/base';
import { EuropeChoropleth } from '~/components/choropleth/europe-choropleth';
import { Text } from '~/components/typography';
import { getCountryNames } from '~/domain/internationaal/logic/get-country-names';
import { getCyclingDataDocumentInfo } from '~/domain/internationaal/logic/get-cycling-data-document-info';
import { useCyclingData } from '~/domain/internationaal/logic/use-cycling-data';
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
    intl: ({ tested_overall }) => ({
      data: tested_overall,
      countryNames: getCountryNames(tested_overall, 'cncode'),
    }),
  }),
  () => getCyclingDataDocumentInfo('json/euro')
);

const InternationalPage = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText, formatDateFromSeconds } = useIntl();
  const {
    lastGenerated,
    choropleth,
    documentCount,
    firstTimestamp: firstDocument,
  } = props;
  const { intl } = choropleth;
  const reverseRouter = useReverseRouter();
  const [stepValue, setStepValue] = useState(1);

  const [data, play, skip, stop, reset, loadingState, currentDate] =
    useCyclingData<typeof intl.data[number]>(
      intl.data,
      firstDocument,
      documentCount
    );

  function loadDate(event: ChangeEvent<HTMLInputElement>) {
    const value = +event.target.value;
    setStepValue(value);
    skip(value);
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
        <Box>
          <Text>{formatDateFromSeconds(currentDate, 'axis-with-year')}</Text>
        </Box>
        <EuropeChoropleth
          data={data}
          metricProperty="infected_per_100k"
          joinProperty="cncode"
          getLink={reverseRouter.vr.positiefGetesteMensen}
          tooltipContent={(context) => (
            <div>
              {intl.countryNames[context.cncode]}: {context.infected_per_100k}
            </div>
          )}
        />
        <Box>
          <button onClick={play}>start animating</button>
          <button onClick={stop}>stop animating</button>
          <button onClick={reset}>reset</button>
          <input
            type="range"
            min={0}
            max={documentCount - 1}
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

export default InternationalPage;
