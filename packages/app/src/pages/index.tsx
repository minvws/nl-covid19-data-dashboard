import { useRouter } from 'next/router';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { CollapsibleButton } from '~/components-styled/collapsible';
import { HighlightTeaserProps } from '~/components-styled/highlight-teaser';
import { Sitemap } from '~/domain/topical/sitemap';
import { MaxWidth } from '~/components-styled/max-width';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { Heading } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { WarningTile } from '~/components-styled/warning-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getDefaultLayout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { Search } from '~/domain/topical/components/search';
import { EditorialSummary } from '~/domain/topical/editorial-teaser';
import { EditorialTile } from '~/domain/topical/editorial-tile';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { TopicalChoroplethContainer } from '~/domain/topical/topical-choropleth-container';
import { TopicalSectionHeader } from '~/domain/topical/topical-section-header';
import { TopicalTile } from '~/domain/topical/topical-tile';
import { TopicalVaccineTile } from '~/domain/topical/topical-vaccine-tile';
import { topicalPageQuery } from '~/queries/topical-page-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getNlData,
  getText,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { formatDate } from '~/utils/formatDate';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { getDataSitemap } from '~/domain/topical/sitemap/utils';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  createGetChoroplethData({
    vr: ({ escalation_levels, tested_overall }) => ({
      escalation_levels,
      tested_overall,
    }),
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    articles: ArticleSummary[];
    editorial: EditorialSummary;
    highlight: HighlightTeaserProps;
  }>(topicalPageQuery),
  () => {
    const data = getNlData();

    for (const metric of Object.values(data)) {
      if (typeof metric === 'object' && metric !== null) {
        for (const [metricProperty, metricValue] of Object.entries(metric)) {
          if (metricProperty === 'values') {
            (metricValue as {
              values: Array<unknown>;
            }).values = [];
          }
        }
      }
    }

    return data;
  }
);

const Home: FCWithLayout<typeof getStaticProps> = (props) => {
  const { text: siteText, data, choropleth, content, lastGenerated } = props;
  const router = useRouter();
  const text = siteText.nationaal_actueel;

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;
  const dataSitemap = getDataSitemap('landelijk');

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <Box bg="white" pb={4}>
        {/**
         * Since now the sections have a H2 heading I think we need to include
         * a hidden H1 here.
         */}
        <VisuallyHidden>
          <Heading level={1}>{text.title}</Heading>
        </VisuallyHidden>

        <MaxWidth id="content">
          <TileList>
            <TopicalSectionHeader
              lastGenerated={Number(lastGenerated)}
              title={replaceComponentsInText(
                text.secties.actuele_situatie.titel,
                {
                  the_netherlands: text.the_netherlands,
                }
              )}
              link={text.secties.actuele_situatie.link}
            />

            <Box width={{ lg: '65%' }}>
              <Search />
            </Box>

            <WarningTile
              message={siteText.regionaal_index.belangrijk_bericht}
              variant="emphasis"
            />

            <MiniTrendTileLayout id="metric-navigation">
              <MiniTrendTile
                title={text.mini_trend_tiles.positief_getest.title}
                text={
                  <DataDrivenText
                    data={data}
                    metricName="tested_overall"
                    metricProperty="infected"
                    differenceKey="tested_overall__infected"
                    valueTexts={
                      text.data_driven_texts.infected_people_total.value
                    }
                    differenceTexts={
                      text.data_driven_texts.infected_people_total.difference
                    }
                  />
                }
                icon={<GetestIcon />}
                trendData={dataInfectedTotal.values}
                metricProperty="infected"
                href="/landelijk/positief-geteste-mensen"
              />

              <MiniTrendTile
                title={text.mini_trend_tiles.ziekenhuis_opnames.title}
                text={
                  <DataDrivenText
                    data={data}
                    metricName="hospital_nice"
                    metricProperty="admissions_on_date_of_reporting"
                    differenceKey="hospital_nice__admissions_on_date_of_reporting"
                    valueTexts={text.data_driven_texts.intake_hospital_ma.value}
                    differenceTexts={
                      text.data_driven_texts.intake_hospital_ma.difference
                    }
                  />
                }
                icon={<ZiekenhuisIcon />}
                trendData={dataHospitalIntake.values}
                metricProperty="admissions_on_date_of_reporting"
                href="/landelijk/ziekenhuis-opnames"
              />

              <TopicalVaccineTile data={data.vaccine_administered_total} />
            </MiniTrendTileLayout>

            <CollapsibleButton
              label={siteText.common_actueel.overview_links_header}
            >
              <Sitemap
                quickLinksHeader={text.quick_links.header}
                quickLinks={[
                  {
                    href: '/landelijk/vaccinaties',
                    text: text.quick_links.links.nationaal,
                  },
                  {
                    href: '/veiligheidsregio',
                    text: text.quick_links.links.veiligheidsregio,
                  },
                  {
                    href: '/gemeente',
                    text: text.quick_links.links.gemeente,
                  },
                ]}
                dataSitemapHeader={text.data_sitemap_titel}
                dataSitemap={dataSitemap}
              />
            </CollapsibleButton>

            {content.editorial && content.highlight && (
              <Box pt={3}>
                <TopicalSectionHeader
                  title={siteText.common_actueel.secties.artikelen.titel}
                />

                <EditorialTile
                  editorial={content.editorial}
                  highlight={content.highlight}
                />
              </Box>
            )}

            <Box pb={4} pt={3}>
              <TopicalSectionHeader
                title={siteText.common_actueel.secties.risicokaart.titel}
              />
              <TopicalTile>
                <TopicalChoroplethContainer
                  description={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: replaceVariablesInText(
                          text.risiconiveaus.selecteer_toelichting,
                          {
                            last_update: formatDate(
                              choropleth.vr.escalation_levels[0]
                                .date_of_insertion_unix,
                              'day-month'
                            ),
                          }
                        ),
                      }}
                    />
                  }
                  legendComponent={
                    <EscalationMapLegenda
                      data={choropleth.vr}
                      metricName="escalation_levels"
                      metricProperty="level"
                    />
                  }
                >
                  <SafetyRegionChoropleth
                    data={choropleth.vr}
                    metricName="escalation_levels"
                    metricProperty="level"
                    onSelect={createSelectRegionHandler(router, 'risiconiveau')}
                    tooltipContent={escalationTooltip(
                      createSelectRegionHandler(router, 'risiconiveau')
                    )}
                  />
                </TopicalChoroplethContainer>
              </TopicalTile>
              <Box
                borderTopWidth="1px"
                borderTopStyle="solid"
                borderTopColor={colors.silver}
                mx={{ _: -3, md: 0 }}
              />
              <TopicalTile py={0}>
                <Box mx={-3}>
                  <EscalationLevelExplanations />
                </Box>
              </TopicalTile>
            </Box>

            <Box pb={4}>
              <TopicalSectionHeader
                title={siteText.common_actueel.secties.meer_lezen.titel}
                description={
                  siteText.common_actueel.secties.meer_lezen.omschrijving
                }
                link={siteText.common_actueel.secties.meer_lezen.link}
              />
              <ArticleList articleSummaries={content.articles} />
            </Box>
          </TileList>
        </MaxWidth>
      </Box>
    </>
  );
};

Home.getLayout = getDefaultLayout();

export default Home;
