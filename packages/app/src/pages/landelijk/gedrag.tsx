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
import { BehaviorChoroplethTile } from '~/domain/behavior/behavior-choropleth-tile';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { BehaviorPageNational } from '~/domain/behavior/behavior-page-national';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData('behavior_per_age_group'),
  createGetChoroplethData({
    vr: ({ behavior }) => ({ behavior }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((context) => {
    const { locale = 'nl' } = context;
    return createPageArticlesQuery('behaviorPage', locale);
  })
);

const BehaviorPage = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();

  const { selectedNlData: data, choropleth, content, lastGenerated } = props;
  const behaviorLastValue = data.behavior.last_value;
  const { nl_gedrag } = siteText;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: nl_gedrag.metadata.title,
    description: nl_gedrag.metadata.description,
  };

  const featureBehaviorPage = useFeature('behaviorPage');

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        {featureBehaviorPage.isEnabled ? (
          <BehaviorPageNational
            data={data}
            content={content}
            behaviorData={choropleth.vr.behavior}
          />
        ) : (
          <TileList>
            <ContentHeader
              category={siteText.nationaal_layout.headings.gedrag}
              title={nl_gedrag.pagina.titel}
              icon={<Gedrag />}
              subtitle={nl_gedrag.pagina.toelichting}
              metadata={{
                datumsText: nl_gedrag.datums,
                dateOrRange: {
                  start: behaviorLastValue.date_start_unix,
                  end: behaviorLastValue.date_end_unix,
                },
                dateOfInsertionUnix: behaviorLastValue.date_of_insertion_unix,
                dataSources: [nl_gedrag.bronnen.rivm],
              }}
              reference={nl_gedrag.reference}
            />

            <ArticleStrip articles={content.articles} />

            <TwoKpiSection>
              <Tile height="100%">
                <Heading level={3}>{nl_gedrag.onderzoek_uitleg.titel}</Heading>
                <Text>{nl_gedrag.onderzoek_uitleg.toelichting}</Text>
              </Tile>

              <KpiTile
                title={nl_gedrag.kpi.aantal_respondenten.titel}
                metadata={{
                  source: nl_gedrag.kpi.aantal_respondenten.bron,
                  date: [
                    behaviorLastValue.date_start_unix,
                    behaviorLastValue.date_end_unix,
                  ],
                }}
              >
                <KpiValue absolute={behaviorLastValue.number_of_participants} />
                <Text>{nl_gedrag.kpi.aantal_respondenten.toelichting}</Text>
              </KpiTile>
            </TwoKpiSection>

            <BehaviorTableTile
              behavior={behaviorLastValue}
              title={nl_gedrag.basisregels.title}
              introduction={nl_gedrag.basisregels.intro}
              footer={nl_gedrag.basisregels.voetnoot}
              footerAsterisk={nl_gedrag.basisregels.voetnoot_asterisk}
            />

            <BehaviorLineChartTile
              values={data.behavior.values}
              title={nl_gedrag.basisregels_over_tijd.title}
              introduction={nl_gedrag.basisregels_over_tijd.intro}
            />

            <BehaviorChoroplethTile data={choropleth.vr} />

            <MoreInformation />
          </TileList>
        )}
      </NationalLayout>
    </Layout>
  );
};

export default BehaviorPage;
