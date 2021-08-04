import {
  EscalationLevels,
  GmCollectionTestedOverall,
  GmGeoProperties,
  VrCollectionTestedOverall,
  VrGeoProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { isEmpty, some } from 'lodash';
import { useState } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import GrafiekIcon from '~/assets/chart.svg';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { Box, Spacer } from '~/components/base';
import {
  ChartRegionControls,
  RegionControlOption,
} from '~/components/chart-region-controls';
import { GmChoropleth, VrChoropleth } from '~/components/choropleth';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { vrThresholds } from '~/components/choropleth/logic';
import {
  GmPositiveTestedPeopleTooltip,
  VrEscalationTooltip,
  VrPositiveTestedPeopleTooltip,
} from '~/components/choropleth/tooltips';
import { CollapsibleButton } from '~/components/collapsible';
import { DataDrivenText } from '~/components/data-driven-text';
import { EscalationMapLegenda } from '~/components/escalation-map-legenda';
import { HighlightTeaserProps } from '~/components/highlight-teaser';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { Metadata } from '~/components/metadata';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { TileList } from '~/components/tile-list';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { ChoroplethTwoColumnLayout } from '~/domain/topical/choropleth-two-column-layout';
import { Search } from '~/domain/topical/components/search';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import {
  HighlightsTile,
  WeeklyHighlightProps,
} from '~/domain/topical/highlights-tile';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { TopicalSectionHeader } from '~/domain/topical/topical-section-header';
import { TopicalTile } from '~/domain/topical/topical-tile';
import { TopicalVaccineTile } from '~/domain/topical/topical-vaccine-tile';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { getTopicalPageQuery } from '~/queries/topical-page-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { createDate } from '~/utils/create-date';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({ escalation_levels, tested_overall }) => ({
      escalation_levels,
      tested_overall,
    }),
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    showWeeklyHighlight: boolean;
    articles?: ArticleSummary[];
    weeklyHighlight?: WeeklyHighlightProps;
    highlights?: HighlightTeaserProps[];
  }>(getTopicalPageQuery),
  selectNlData(
    'tested_overall',
    'hospital_nice',
    'difference',
    'vaccine_administered_total'
  )
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;
  const dataSitemap = useDataSitemap('nl');

  const { siteText, formatDate } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.nationaal_actueel;

  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');

  const unknownLevelColor = useEscalationColor(null);
  const internationalFeature = useFeature('inPositiveTestsPage');

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg="white" py={4}>
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
              headingLevel={1}
              link={{
                ...text.secties.actuele_situatie.link,
                href: reverseRouter.nl.index(),
              }}
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
                    differenceKey="tested_overall__infected_moving_average"
                    valueTexts={
                      text.data_driven_texts.infected_people_total.value
                    }
                    differenceText={
                      siteText.common_actueel.secties.kpi.zeven_daags_gemiddelde
                    }
                  />
                }
                icon={<GetestIcon />}
                trendData={dataInfectedTotal.values}
                metricProperty="infected"
                href={reverseRouter.nl.positiefGetesteMensen()}
                accessibility={{ key: 'topical_tested_overall' }}
              />

              <MiniTrendTile
                title={text.mini_trend_tiles.ziekenhuis_opnames.title}
                text={
                  <DataDrivenText
                    data={data}
                    metricName="hospital_nice"
                    metricProperty="admissions_on_date_of_reporting"
                    differenceKey="hospital_nice__admissions_on_date_of_reporting_moving_average"
                    valueTexts={text.data_driven_texts.intake_hospital_ma.value}
                    differenceText={
                      siteText.common_actueel.secties.kpi.zeven_daags_gemiddelde
                    }
                  />
                }
                icon={<ZiekenhuisIcon />}
                trendData={dataHospitalIntake.values}
                metricProperty="admissions_on_date_of_reporting"
                href={reverseRouter.nl.ziekenhuisopnames()}
                accessibility={{ key: 'topical_hospital_nice' }}
              />

              <TopicalVaccineTile data={data.vaccine_administered_total} />
            </MiniTrendTileLayout>

            <CollapsibleButton
              label={siteText.common_actueel.overview_links_header}
              icon={<GrafiekIcon />}
            >
              <Sitemap
                quickLinksHeader={text.quick_links.header}
                quickLinks={[
                  {
                    href: reverseRouter.nl.index(),
                    text: text.quick_links.links.nationaal,
                  },
                  {
                    href: reverseRouter.vr.index(),
                    text: text.quick_links.links.veiligheidsregio,
                  },
                  {
                    href: reverseRouter.gm.index(),
                    text: text.quick_links.links.gemeente,
                  },
                  internationalFeature.isEnabled
                    ? {
                        href: reverseRouter.in.index(),
                        text: text.quick_links.links.internationaal,
                      }
                    : undefined,
                ].filter(isDefined)}
                dataSitemapHeader={text.data_sitemap_titel}
                dataSitemap={dataSitemap}
              />
            </CollapsibleButton>

            {content.weeklyHighlight && content.highlights && (
              <Box pt={3}>
                <TopicalSectionHeader
                  title={siteText.common_actueel.secties.artikelen.titel}
                />

                <HighlightsTile
                  weeklyHighlight={content.weeklyHighlight}
                  highlights={content.highlights}
                  showWeeklyHighlight={content.showWeeklyHighlight}
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
                  <VrChoropleth
                    accessibility={{
                      key: 'topical_escalation_levels_choropleth',
                    }}
                    data={choropleth.vr}
                    getLink={reverseRouter.vr.risiconiveau}
                    metricName="escalation_levels"
                    metricProperty="level"
                    noDataFillColor={unknownLevelColor}
                    tooltipContent={(
                      context: VrGeoProperties & EscalationLevels
                    ) => (
                      <VrEscalationTooltip
                        context={context}
                        getLink={reverseRouter.vr.risiconiveau}
                      />
                    )}
                  />
                </Box>
                <Box spacing={3}>
                  {text.risiconiveaus.belangrijk_bericht &&
                    !isEmpty(text.risiconiveaus.belangrijk_bericht) && (
                      <Box mb={3}>
                        <WarningTile
                          message={text.risiconiveaus.belangrijk_bericht}
                          variant="emphasis"
                        />
                      </Box>
                    )}

                  <Markdown
                    content={replaceVariablesInText(
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
                    )}
                  />
                </Box>
              </ChoroplethTwoColumnLayout>

              <Spacer mb={4} />

              <EscalationLevelExplanations
                hasUnknownLevel={some(
                  choropleth.vr.escalation_levels,
                  (x) => !isPresent(x)
                )}
              />
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
                    thresholds={vrThresholds.tested_overall.infected_per_100k}
                    title={
                      siteText.positief_geteste_personen.chloropleth_legenda
                        .titel
                    }
                  />
                }
              >
                <>
                  {selectedMap === 'gm' && (
                    <GmChoropleth
                      accessibility={{
                        key: 'topical_municipal_tested_overall_choropleth',
                      }}
                      data={choropleth.gm}
                      metricName="tested_overall"
                      metricProperty="infected_per_100k"
                      getLink={reverseRouter.gm.positiefGetesteMensen}
                      tooltipContent={(
                        context: GmGeoProperties & GmCollectionTestedOverall
                      ) => <GmPositiveTestedPeopleTooltip context={context} />}
                    />
                  )}
                  {selectedMap === 'vr' && (
                    <VrChoropleth
                      accessibility={{
                        key: 'topical_region_tested_overall_choropleth',
                      }}
                      data={choropleth.vr}
                      getLink={reverseRouter.vr.positiefGetesteMensen}
                      metricName="tested_overall"
                      metricProperty="infected_per_100k"
                      tooltipContent={(
                        context: VrGeoProperties & VrCollectionTestedOverall
                      ) => <VrPositiveTestedPeopleTooltip context={context} />}
                    />
                  )}
                </>
                <Box spacing={3}>
                  <Metadata
                    date={
                      choropleth.vr.escalation_levels[0].date_of_insertion_unix
                    }
                    source={siteText.positief_geteste_personen.bronnen.rivm}
                  />
                  <Text>
                    {siteText.positief_geteste_personen.map_toelichting}
                  </Text>
                  <Box css={css({ '> div': { justifyContent: 'flex-start' } })}>
                    <ChartRegionControls
                      value={selectedMap}
                      onChange={setSelectedMap}
                    />
                  </Box>
                </Box>
              </ChoroplethTwoColumnLayout>
            </TopicalTile>

            <TopicalTile>
              <TopicalSectionHeader
                title={siteText.common_actueel.secties.meer_lezen.titel}
                description={
                  siteText.common_actueel.secties.meer_lezen.omschrijving
                }
                link={siteText.common_actueel.secties.meer_lezen.link}
              />
              <ArticleList articleSummaries={content.articles} />
            </TopicalTile>
          </TileList>
        </MaxWidth>
      </Box>
    </Layout>
  );
};

export default Home;
