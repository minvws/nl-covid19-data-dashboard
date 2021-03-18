import css from '@styled-system/css';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import {
  ChartRegionControls,
  RegionControlOption,
} from '~/components-styled/chart-region-controls';
import { ChoroplethLegenda } from '~/components-styled/choropleth-legenda';
import { CollapsibleButton } from '~/components-styled/collapsible';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { HighlightTeaserProps } from '~/components-styled/highlight-teaser';
import { MaxWidth } from '~/components-styled/max-width';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { Heading, Text } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { WarningTile } from '~/components-styled/warning-tile';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/create-positive-tested-people-regional-tooltip';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getDefaultLayout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { ChoroplethTwoColumnLayout } from '~/domain/topical/choropleth-two-column-layout';
import { Search } from '~/domain/topical/components/search';
import { EditorialSummary } from '~/domain/topical/editorial-teaser';
import { EditorialTile } from '~/domain/topical/editorial-tile';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { Sitemap } from '~/domain/topical/sitemap';
import { getDataSitemap } from '~/domain/topical/sitemap/utils';
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
import { createDate } from '~/utils/createDate';
import { formatDate } from '~/utils/formatDate';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
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

  const [selectedMap, setSelectedMap] = useState<RegionControlOption>(
    'municipal'
  );

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

            <TopicalTile>
              <TopicalSectionHeader
                title={siteText.common_actueel.secties.risicokaart.titel}
                link={siteText.common_actueel.secties.risicokaart.link}
              />
              <ChoroplethTwoColumnLayout
                legendComponent={
                  <EscalationMapLegenda
                    data={choropleth.vr}
                    metricName="escalation_levels"
                    metricProperty="level"
                    lastDetermined={
                      choropleth.vr.escalation_levels[0].last_determined_unix
                    }
                  />
                }
              >
                <Box>
                  <SafetyRegionChoropleth
                    data={choropleth.vr}
                    metricName="escalation_levels"
                    metricProperty="level"
                    onSelect={createSelectRegionHandler(router, 'risiconiveau')}
                    tooltipContent={escalationTooltip(
                      createSelectRegionHandler(router, 'risiconiveau')
                    )}
                  />
                </Box>
                <Box>
                  {text.risiconiveaus.belangrijk_bericht &&
                    !isEmpty(text.risiconiveaus.belangrijk_bericht) && (
                      <Box mb={3}>
                        <WarningTile
                          message={text.risiconiveaus.belangrijk_bericht}
                          variant="emphasis"
                        />
                      </Box>
                    )}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: replaceVariablesInText(
                        text.risiconiveaus.selecteer_toelichting,
                        {
                          last_update: formatDate(
                            createDate(
                              choropleth.vr.escalation_levels[0]
                                .last_determined_unix
                            ),
                            'day-month'
                          ),
                        }
                      ),
                    }}
                  />
                </Box>
              </ChoroplethTwoColumnLayout>

              <Box mt={4}>
                <EscalationLevelExplanations />
              </Box>
            </TopicalTile>

            <TopicalTile>
              <TopicalSectionHeader
                title={
                  siteText.common_actueel.secties.positief_getest_kaart.titel
                }
              />

              <ChoroplethTwoColumnLayout
                legendComponent={
                  <ChoroplethLegenda
                    thresholds={
                      regionThresholds.tested_overall.infected_per_100k
                    }
                    title={
                      siteText.positief_geteste_personen.chloropleth_legenda
                        .titel
                    }
                  />
                }
              >
                <>
                  {selectedMap === 'municipal' && (
                    <MunicipalityChoropleth
                      data={choropleth.gm}
                      metricName="tested_overall"
                      metricProperty="infected_per_100k"
                      tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
                        siteText.choropleth_tooltip.positive_tested_people,
                        regionThresholds.tested_overall.infected_per_100k,
                        createSelectMunicipalHandler(
                          router,
                          'positief-geteste-mensen'
                        )
                      )}
                      onSelect={createSelectMunicipalHandler(
                        router,
                        'positief-geteste-mensen'
                      )}
                    />
                  )}
                  {selectedMap === 'region' && (
                    <SafetyRegionChoropleth
                      data={choropleth.vr}
                      metricName="tested_overall"
                      metricProperty="infected_per_100k"
                      tooltipContent={createPositiveTestedPeopleRegionalTooltip(
                        siteText.choropleth_tooltip.positive_tested_people,
                        regionThresholds.tested_overall.infected_per_100k,
                        createSelectRegionHandler(
                          router,
                          'positief-geteste-mensen'
                        )
                      )}
                      onSelect={createSelectRegionHandler(
                        router,
                        'positief-geteste-mensen'
                      )}
                    />
                  )}
                </>
                <Box>
                  <Text>
                    {siteText.positief_geteste_personen.map_toelichting}
                  </Text>
                  <Box
                    mb={4}
                    css={css({ '> div': { justifyContent: 'flex-start' } })}
                  >
                    <ChartRegionControls
                      value={selectedMap}
                      onChange={setSelectedMap}
                    />
                  </Box>
                </Box>
              </ChoroplethTwoColumnLayout>
            </TopicalTile>

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
