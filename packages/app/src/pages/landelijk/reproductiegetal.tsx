import { getLastFilledValue } from '@corona-dashboard/common';
import { Reproductiegetal } from '@corona-dashboard/icons';
import { KpiWithIllustrationTile } from '~/components/kpi-with-illustration-tile';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { PageKpi } from '~/components/page-kpi';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
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
  selectNlData,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData('reproduction', 'difference.reproduction__index_average'),
  createGetContent<PageArticlesQueryResult>((context) => {
    const { locale } = context;
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
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              siteText.sidebar.metrics.reproduction_number.title
            }
            title={text.titel}
            icon={<Reproductiegetal />}
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
              <PageKpi
                data={data}
                metricName="reproduction"
                metricProperty="index_average"
                differenceKey="reproduction__index_average"
                differenceFractionDigits={2}
                showOldDateUnix
                isAmount={false}
              />
              <Markdown content={text.barscale_toelichting} />
            </KpiWithIllustrationTile>
          </TwoKpiSection>

          <ReproductionChartTile data={data.reproduction} />
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default ReproductionIndex;
