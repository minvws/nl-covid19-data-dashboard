import {
  EscalationLevels,
  MunicipalitiesTestedOverall,
  MunicipalityProperties,
  RegionsTestedOverall,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
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
import { Markdown } from '~/components-styled/markdown';
import { MaxWidth } from '~/components-styled/max-width';
import { Metadata } from '~/components-styled/metadata';
import { RiskLevelIndicator } from '~/components-styled/risk-level-indicator';
import { TileList } from '~/components-styled/tile-list';
import { Heading, Text } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { WarningTile } from '~/components-styled/warning-tile';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { PositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/positive-tested-people-municipal-tooltip';
import { EscalationRegionalTooltip } from '~/components/choropleth/tooltips/region/escalation-regional-tooltip';
import { PositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/positive-tested-people-regional-tooltip';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { ChoroplethTwoColumnLayout } from '~/domain/topical/choropleth-two-column-layout';
import {
  HighlightsTile,
  WeeklyHighlightProps,
} from '~/domain/topical/highlights-tile';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { Sitemap } from '~/domain/topical/sitemap';
import { useDataSitemap } from '~/domain/topical/sitemap/utils';
import { TopicalSectionHeader } from '~/domain/topical/topical-section-header';
import { TopicalTile } from '~/domain/topical/topical-tile';
import { useIntl } from '~/intl';
import { getTopicalPageQuery } from '~/queries/topical-page-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getVrData,
} from '~/static-props/get-data';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData,
  createGetChoroplethData({
    vr: ({ escalation_levels, tested_overall }) => ({
      escalation_levels,
      tested_overall,
    }),
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    articles: ArticleSummary[];
    weeklyHighlight: WeeklyHighlightProps;
    highlights: HighlightTeaserProps[];
  }>(getTopicalPageQuery)
);

const TopicalSafetyRegion = (props: StaticProps<typeof getStaticProps>) => {
  const { choropleth, data, content, lastGenerated } = props;
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { siteText, formatDate } = useIntl();

  const text = siteText.veiligheidsregio_actueel;
  const escalationText = siteText.escalatie_niveau;
  const vrCode = router.query.code as string;

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;

  const [selectedMap, setSelectedMap] = useState<RegionControlOption>(
    'municipal'
  );

  const dataSitemap = useDataSitemap('veiligheidsregio', vrCode);

  const metadata = {
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegionName: props.safetyRegionName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName: props.safetyRegionName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg="white" pb={4}>
        {/**
         * Since now the sections have a H2 heading I think we need to include
         * a hidden H1 here.
         *
         * @TODO figure out what the title should be
         */}
        <VisuallyHidden>
          <Heading level={1}>
            {replaceComponentsInText(text.title, {
              safetyRegionName: props.safetyRegionName,
            })}
          </Heading>
        </VisuallyHidden>

        <MaxWidth id="content">
          <TileList>
            <TopicalSectionHeader
              showBackLink
              lastGenerated={Number(props.lastGenerated)}
              title={replaceComponentsInText(
                text.secties.actuele_situatie.titel,
                {
                  safetyRegionName: props.safetyRegionName,
                }
              )}
              link={{
                text: replaceVariablesInText(
                  text.secties.actuele_situatie.link.text,
                  {
                    safetyRegionName: props.safetyRegionName,
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
                href={`/veiligheidsregio/${router.query.code}/positief-geteste-mensen`}
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
                href={`/veiligheidsregio/${router.query.code}/ziekenhuis-opnames`}
              />

              <RiskLevelIndicator
                title={text.risoconiveau_maatregelen.title}
                description={text.risoconiveau_maatregelen.description}
                level={data.escalation_level.level}
                code={data.code}
                escalationTypes={escalationText.types}
                href={`/veiligheidsregio/${router.query.code}/risiconiveau`}
              >
                <Link href={`/veiligheidsregio/${vrCode}/maatregelen`}>
                  <a>{text.risoconiveau_maatregelen.bekijk_href}</a>
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
                    href: '/landelijk/vaccinaties',
                    text: text.quick_links.links.nationaal,
                  },
                  {
                    href: `/veiligheidsregio/${router.query.code}/positief-geteste-mensen`,
                    text: replaceVariablesInText(
                      text.quick_links.links.veiligheidsregio,
                      { safetyRegionName: props.safetyRegionName }
                    ),
                  },
                  { href: '/gemeente', text: text.quick_links.links.gemeente },
                ]}
                dataSitemapHeader={replaceVariablesInText(
                  text.data_sitemap_title,
                  { safetyRegionName: props.safetyRegionName }
                )}
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
                    getLink={reverseRouter.vr.risiconiveau}
                    metricName="escalation_levels"
                    metricProperty="level"
                    tooltipContent={(
                      context: SafetyRegionProperties & EscalationLevels
                    ) => (
                      <EscalationRegionalTooltip
                        context={context}
                        getLink={reverseRouter.vr.risiconiveau}
                      />
                    )}
                  />
                </Box>
                <Box>
                  {siteText.nationaal_actueel.risiconiveaus
                    .belangrijk_bericht &&
                    !isEmpty(
                      siteText.nationaal_actueel.risiconiveaus
                        .belangrijk_bericht
                    ) && (
                      <Box mb={3}>
                        <WarningTile
                          message={
                            siteText.nationaal_actueel.risiconiveaus
                              .belangrijk_bericht
                          }
                          variant="emphasis"
                        />
                      </Box>
                    )}
                  <Box mb={3}>
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
                      getLink={reverseRouter.gm.positiefGetesteMensen}
                      metricName="tested_overall"
                      metricProperty="infected_per_100k"
                      tooltipContent={(
                        context: MunicipalityProperties &
                          MunicipalitiesTestedOverall
                      ) => (
                        <PositiveTestedPeopleMunicipalTooltip
                          context={context}
                        />
                      )}
                    />
                  )}
                  {selectedMap === 'region' && (
                    <SafetyRegionChoropleth
                      data={choropleth.vr}
                      getLink={reverseRouter.vr.positiefGetesteMensen}
                      metricName="tested_overall"
                      metricProperty="infected_per_100k"
                      tooltipContent={(
                        context: SafetyRegionProperties & RegionsTestedOverall
                      ) => (
                        <PositiveTestedPeopleRegionalTooltip
                          context={context}
                        />
                      )}
                    />
                  )}
                </>
                <Box>
                  <Metadata
                    date={
                      choropleth.vr.escalation_levels[0].date_of_insertion_unix
                    }
                    source={siteText.positief_geteste_personen.bronnen.rivm}
                  />

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
    </Layout>
  );
};

export default TopicalSafetyRegion;
