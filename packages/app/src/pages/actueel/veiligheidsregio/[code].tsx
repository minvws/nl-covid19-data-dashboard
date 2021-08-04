import {
  EscalationLevels,
  GmCollectionTestedOverall,
  GmGeoProperties,
  VrCollectionTestedOverall,
  VrGeoProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { some } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
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
import { RiskLevelIndicator } from '~/components/risk-level-indicator';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { TileList } from '~/components/tile-list';
import { Anchor, Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { getEscalationLevelIndexKey } from '~/domain/escalation-level/get-escalation-level-index-key';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { ChoroplethTwoColumnLayout } from '~/domain/topical/choropleth-two-column-layout';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import {
  HighlightsTile,
  WeeklyHighlightProps,
} from '~/domain/topical/highlights-tile';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { TopicalSectionHeader } from '~/domain/topical/topical-section-header';
import { TopicalTile } from '~/domain/topical/topical-tile';
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
  selectVrData,
} from '~/static-props/get-data';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrData(
    'tested_overall',
    'hospital_nice',
    'code',
    'escalation_level',
    'difference'
  ),
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
  }>(getTopicalPageQuery)
);

const TopicalVr = (props: StaticProps<typeof getStaticProps>) => {
  const {
    choropleth,
    selectedVrData: data,
    content,
    lastGenerated,
    vrName,
  } = props;
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { siteText, formatDate } = useIntl();

  const text = siteText.veiligheidsregio_actueel;
  const escalationText = siteText.escalatie_niveau;
  const vrCode = router.query.code as string;

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;

  const unknownLevelColor = useEscalationColor(null);
  const internationalFeature = useFeature('inPositiveTestsPage');

  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');

  const dataSitemap = useDataSitemap('vr', vrCode);

  const metadata = {
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg="white" py={4}>
        <MaxWidth id="content">
          <TileList>
            <TopicalSectionHeader
              showBackLink
              lastGenerated={Number(props.lastGenerated)}
              title={replaceComponentsInText(
                text.secties.actuele_situatie.titel,
                {
                  safetyRegionName: vrName,
                }
              )}
              headingLevel={1}
              link={{
                text: replaceVariablesInText(
                  text.secties.actuele_situatie.link.text,
                  {
                    safetyRegionName: vrName,
                  }
                ),
                href: replaceVariablesInText(
                  text.secties.actuele_situatie.link.href,
                  { vrCode }
                ),
              }}
            />

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
                href={reverseRouter.vr.positiefGetesteMensen(vrCode)}
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
                href={reverseRouter.vr.ziekenhuisopnames(vrCode)}
                accessibility={{ key: 'topical_hospital_nice' }}
              />

              <RiskLevelIndicator
                title={text.risoconiveau_maatregelen.title}
                description={text.risoconiveau_maatregelen.description}
                level={data.escalation_level.level}
                code={data.code}
                levelTitle={
                  escalationText.types[
                    getEscalationLevelIndexKey(data.escalation_level.level)
                  ].titel
                }
                href={reverseRouter.vr.risiconiveau(vrCode)}
              >
                <Link href={reverseRouter.vr.maatregelen(vrCode)} passHref>
                  <Anchor underline>
                    {text.risoconiveau_maatregelen.bekijk_href}
                  </Anchor>
                </Link>
              </RiskLevelIndicator>
            </MiniTrendTileLayout>

            <CollapsibleButton
              label={siteText.common_actueel.overview_links_header}
            >
              <Sitemap
                quickLinksHeader={text.quick_links.header}
                quickLinks={[
                  {
                    href: reverseRouter.nl.index(),
                    text: text.quick_links.links.nationaal,
                  },
                  {
                    href: reverseRouter.vr.index(router.query.code as string),
                    text: replaceVariablesInText(
                      text.quick_links.links.veiligheidsregio,
                      { safetyRegionName: vrName }
                    ),
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
                dataSitemapHeader={replaceVariablesInText(
                  text.data_sitemap_title,
                  { safetyRegionName: vrName }
                )}
                dataSitemap={dataSitemap}
              />
            </CollapsibleButton>

            {content.weeklyHighlight && content.highlights && (
              <TopicalTile>
                <TopicalSectionHeader
                  title={siteText.common_actueel.secties.artikelen.titel}
                />

                <HighlightsTile
                  weeklyHighlight={content.weeklyHighlight}
                  highlights={content.highlights}
                  showWeeklyHighlight={content.showWeeklyHighlight}
                />
              </TopicalTile>
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
                  {siteText.nationaal_actueel.risiconiveaus
                    .belangrijk_bericht && (
                    <WarningTile
                      message={
                        siteText.nationaal_actueel.risiconiveaus
                          .belangrijk_bericht
                      }
                      variant="emphasis"
                    />
                  )}

                  <Markdown
                    content={replaceVariablesInText(
                      text.risiconiveaus.selecteer_toelichting,
                      {
                        last_update: formatDate(
                          choropleth.vr.escalation_levels[0]
                            .date_of_insertion_unix,
                          'day-month'
                        ),
                      }
                    )}
                  />
                </Box>
              </ChoroplethTwoColumnLayout>

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
                      getLink={reverseRouter.gm.positiefGetesteMensen}
                      metricName="tested_overall"
                      metricProperty="infected_per_100k"
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

export default TopicalVr;
