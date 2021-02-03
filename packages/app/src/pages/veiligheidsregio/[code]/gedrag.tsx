import Gedrag from '~/assets/gedrag.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { SEOHead } from '~/components-styled/seo-head';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import siteText from '~/locale/index';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getVrData,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('behaviorPage'))
);

const text = siteText.regionaal_gedrag;

const BehaviorPage: FCWithLayout<typeof getStaticProps> = (props) => {
  const content = props.content;
  const behaviorData = props.data.behavior;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
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
            dateOfInsertionUnix: behaviorData.last_value.date_of_insertion_unix,
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
    </>
  );
};

BehaviorPage.getLayout = getSafetyRegionLayout();

export default BehaviorPage;
