import Gedrag from '~/assets/gedrag.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, Text } from '~/components/typography';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorPageSafetyRegion } from '~/domain/behavior/redesign/_behavior-page-safety-region';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData(),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((context) => {
    const { locale = 'nl' } = context;
    return createPageArticlesQuery('behaviorPage', locale);
  })
);

const BehaviorPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    lastGenerated,
    content,
    selectedVrData: data,
    safetyRegionName,
  } = props;
  const behaviorData = data.behavior;

  const { siteText } = useIntl();
  const text = siteText.regionaal_gedrag;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const featureBehaviorPage = useFeature('behaviorPage');

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        {featureBehaviorPage.isEnabled ? (
          <BehaviorPageSafetyRegion data={data} content={content} />
        ) : (
          <TileList>
            <ContentHeader
              category={siteText.nationaal_layout.headings.gedrag}
              title={text.pagina.titel}
              icon={<Gedrag />}
              subtitle={text.pagina.toelichting}
              metadata={{
                datumsText: text.datums,
                dateOrRange: {
                  start: behaviorData.last_value.date_start_unix,
                  end: behaviorData.last_value.date_end_unix,
                },
                dateOfInsertionUnix:
                  behaviorData.last_value.date_of_insertion_unix,
                dataSources: [text.bronnen.rivm],
              }}
              reference={text.reference}
            />

            <ArticleStrip articles={content.articles} />

            <TwoKpiSection>
              <Tile height="100%">
                <Heading level={3}>{text.onderzoek_uitleg.titel}</Heading>
                <Text>{text.onderzoek_uitleg.toelichting}</Text>
              </Tile>

              <KpiTile
                title={text.kpi.aantal_respondenten.titel}
                metadata={{
                  source: text.kpi.aantal_respondenten.bron,
                  date: [
                    behaviorData.last_value.date_start_unix,
                    behaviorData.last_value.date_end_unix,
                  ],
                }}
              >
                <KpiValue
                  absolute={behaviorData.last_value.number_of_participants}
                />
                <Text>{text.kpi.aantal_respondenten.toelichting}</Text>
              </KpiTile>
            </TwoKpiSection>

            <BehaviorTableTile
              behavior={behaviorData.last_value}
              title={text.basisregels.title}
              introduction={text.basisregels.intro}
              footer={text.basisregels.voetnoot}
              footerAsterisk={text.basisregels.voetnoot_asterisk}
            />

            <BehaviorLineChartTile
              title={text.basisregels_over_tijd.title}
              introduction={text.basisregels_over_tijd.intro}
              values={behaviorData.values}
            />

            <MoreInformation />
          </TileList>
        )}
      </SafetyRegionLayout>
    </Layout>
  );
};

export default BehaviorPage;
