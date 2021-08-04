import { getLastFilledValue } from '@corona-dashboard/common';
import Repro from '~/assets/reproductiegetal.svg';
import { KpiWithIllustrationTile } from '~/components/kpi-with-illustration-tile';
import { PageBarScale } from '~/components/page-barscale';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { ReproductionChartTile } from '~/domain/tested/reproduction-chart-tile';
import { useIntl } from '~/intl';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(),
  createGetContent<PageArticlesQueryResult>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('reproductionPage', locale);
  })
);

const ReproductionIndex = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, content, lastGenerated } = props;

  const lastFilledValue = getLastFilledValue(data.reproduction);

  const { siteText } = useIntl();
  const text = siteText.reproductiegetal;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={siteText.reproductiegetal.titel_sidebar}
            title={text.titel}
            icon={<Repro />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: lastFilledValue.date_unix,
              dateOfInsertionUnix: lastFilledValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiWithIllustrationTile
              title={text.barscale_titel}
              metadata={{
                date: lastFilledValue.date_unix,
                source: text.bronnen.rivm,
                obtainedAt: lastFilledValue.date_of_insertion_unix,
              }}
              illustration={{
                image: '/images/reproductie-explainer.svg',
                alt: text.reproductie_explainer_alt,
                description: text.extra_uitleg,
              }}
            >
              <PageBarScale
                data={data}
                scope="nl"
                metricName="reproduction"
                metricProperty="index_average"
                localeTextKey="reproductiegetal"
                differenceKey="reproduction__index_average"
                differenceFractionDigits={2}
              />
              <Text>{text.barscale_toelichting}</Text>
            </KpiWithIllustrationTile>
          </TwoKpiSection>

          <ReproductionChartTile data={data.reproduction} />
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default ReproductionIndex;
