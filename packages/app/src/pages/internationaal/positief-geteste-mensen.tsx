import Getest from '~/assets/test.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { EuropeChoropleth } from '~/components/choropleth/europe-choropleth';
import { internationalThresholds } from '~/components/choropleth/international-thresholds';
import { InternationalTooltip } from '~/components/choropleth/tooltips/international/positive-tested-people-international-tooltip';
import { ContentHeader } from '~/components/content-header';
import { TileList } from '~/components/tile-list';
import { EuropeChoroplethTile } from '~/domain/internationaal/europe-choropleth-tile';
import { InternationalLayout } from '~/domain/layout/international-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { getCountryNames } from '~/static-props/utils/get-country-names';

export type TestData = {
  date_unix: number;
  cncode: string;
  infected_per_100k: number;
  date_of_insertion_unix: number;
};

export type TestData2 = {
  date_unix: number;
  cncode: string;
  infected_per_200k: number;
  date_of_insertion_unix: number;
};

export interface International {
  last_generated: string;
  proto_name: 'IN_COLLECTION';
  name: string;
  code: string;
  tested_overall: TestData[];
  tested_overall2: TestData2[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('in_positiveTestsPage', locale);
  }),
  createGetChoroplethData({
    in: ({ tested_overall }) => tested_overall,
  }),
  getCountryNames
);

export default function PositiefGetesteMensenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { lastGenerated, content, choropleth, countryNames } = props;

  const intl = useIntl();
  const text = intl.siteText.internationaal_positief_geteste_personen;

  const metadata = {
    ...intl.siteText.internationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <InternationalLayout lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            title={text.titel}
            icon={<Getest />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: 0, // @TODO date
              dateOfInsertionUnix: 0, // @TODO date
              dataSources: [text.bronnen.rivm],
            }}
            reference={text.reference}
          />
          {content.articles && <ArticleStrip articles={content.articles} />}
          <EuropeChoroplethTile
            title="Verdeling van positief geteste mensen"
            description="Deze kaart laat zien..."
            legend={{
              thresholds: internationalThresholds.infected_per_100k,
              title: 'Aantal per 100.000 inwoners',
            }}
            metadata={{
              source: {
                href: '',
                text: 'RIVM',
              },
            }}
          >
            <EuropeChoropleth
              data={choropleth.in}
              joinProperty="cncode"
              metricProperty="infected_per_100k"
              tooltipContent={(context) => (
                <InternationalTooltip
                  countryName={countryNames[context.cncode.toLowerCase()]}
                  value={context.infected_per_100k}
                />
              )}
            />
          </EuropeChoroplethTile>
        </TileList>
      </InternationalLayout>
    </Layout>
  );
}
