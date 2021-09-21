import {
  GmCollectionTestedOverall,
  VrCollectionTestedOverall,
} from '@corona-dashboard/common';
import { Chart, Test, Vaccinaties, Ziekenhuis } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import {
  ChartRegionControls,
  RegionControlOption,
} from '~/components/chart-region-controls';
import { DynamicChoropleth, OptionalDataConfig } from '~/components/choropleth';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { InferedMapType } from '~/components/choropleth/logic';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { CollapsibleButton } from '~/components/collapsible';
import { DataDrivenText } from '~/components/data-driven-text';
import { HighlightTeaserProps } from '~/components/highlight-teaser';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { Metadata } from '~/components/metadata';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { ChoroplethTwoColumnLayout } from '~/domain/topical/choropleth-two-column-layout';
import { Search } from '~/domain/topical/components/search';
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
import { SiteText } from '~/locale';
import {
  ElementsQueryResult,
  getWarning,
} from '~/queries/create-elements-query';
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
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({ tested_overall }) => ({
      tested_overall,
    }),
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    showWeeklyHighlight: boolean;
    articles?: ArticleSummary[];
    weeklyHighlight?: WeeklyHighlightProps;
    highlights?: HighlightTeaserProps[];
    elements: ElementsQueryResult;
  }>(getTopicalPageQuery),
  selectNlData(
    'tested_overall',
    'hospital_nice',
    'difference',
    'vaccine_administered_total'
  )
);

type ChoroplethConfig<
  T extends GmCollectionTestedOverall | VrCollectionTestedOverall
> = {
  dataConfig: OptionalDataConfig<T>;
  accessibility: keyof SiteText['accessibility']['charts'];
  map: InferedMapType<T>;
  data: T[];
  getLink: (code: string) => string;
};

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;
  const dataVaccines = data.vaccine_administered_total;
  const dataSitemap = useDataSitemap('nl');

  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.nationaal_actueel;

  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');

  const internationalFeature = useFeature('inPositiveTestsPage');

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const choroplethConfig = useMemo<
    ChoroplethConfig<GmCollectionTestedOverall | VrCollectionTestedOverall>
  >(() => {
    return {
      dataConfig: {
        metricName: 'tested_overall',
        metricProperty: 'infected_per_100k',
      },
      accessibility:
        selectedMap === 'gm'
          ? 'topical_municipal_tested_overall_choropleth'
          : 'topical_region_tested_overall_choropleth',
      map: selectedMap as InferedMapType<
        GmCollectionTestedOverall | VrCollectionTestedOverall
      >,
      data:
        selectedMap === 'gm'
          ? choropleth.gm.tested_overall
          : choropleth.vr.tested_overall,
      getLink:
        selectedMap === 'gm'
          ? reverseRouter.gm.positiefGetesteMensen
          : reverseRouter.vr.positiefGetesteMensen,
    };
  }, [selectedMap, choropleth, reverseRouter]);

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
                    isAmount
                  />
                }
                icon={<Test />}
                trendData={dataInfectedTotal.values}
                metricProperty="infected"
                href={reverseRouter.nl.positiefGetesteMensen()}
                accessibility={{ key: 'topical_tested_overall' }}
                warning={getWarning(
                  content.elements.timeSeries,
                  'tested_overall'
                )}
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
                    isAmount
                  />
                }
                icon={<Ziekenhuis />}
                trendData={dataHospitalIntake.values}
                metricProperty="admissions_on_date_of_reporting"
                href={reverseRouter.nl.ziekenhuisopnames()}
                accessibility={{ key: 'topical_hospital_nice' }}
                warning={getWarning(
                  content.elements.timeSeries,
                  'hospital_nice'
                )}
              />

              <MiniTrendTile
                title={text.mini_trend_tiles.toegediende_vaccins.title}
                text={replaceComponentsInText(
                  text.mini_trend_tiles.toegediende_vaccins.administered_tests,
                  {
                    administeredVaccines: (
                      <strong>
                        {formatNumber(
                          data.vaccine_administered_total.last_value.estimated
                        )}
                      </strong>
                    ),
                  }
                )}
                icon={<Vaccinaties />}
                timeframe="all"
                trendData={dataVaccines.values}
                accessibility={{
                  key: 'topical_vaccine_administrations_over_time',
                }}
                metricProperty="estimated"
                href={reverseRouter.nl.vaccinaties()}
                warning={getWarning(
                  content.elements.timeSeries,
                  'vaccine_administered_total'
                )}
              />
            </MiniTrendTileLayout>

            <CollapsibleButton
              label={siteText.common_actueel.overview_links_header}
              icon={<Chart />}
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
                title={
                  siteText.common_actueel.secties.positief_getest_kaart.titel
                }
              />

              <ChoroplethTwoColumnLayout
                legendComponent={
                  <ChoroplethLegenda
                    thresholds={thresholds.vr.infected_per_100k}
                    title={
                      siteText.positief_geteste_personen.chloropleth_legenda
                        .titel
                    }
                  />
                }
              >
                <DynamicChoropleth
                  renderTarget="canvas"
                  accessibility={{
                    key: choroplethConfig.accessibility,
                  }}
                  map={choroplethConfig.map}
                  data={choroplethConfig.data}
                  dataConfig={choroplethConfig.dataConfig}
                  dataOptions={{
                    getLink: choroplethConfig.getLink,
                  }}
                />
                <Box spacing={3}>
                  <Metadata
                    date={
                      choropleth.vr.tested_overall[0].date_of_insertion_unix
                    }
                    source={siteText.positief_geteste_personen.bronnen.rivm}
                  />
                  <Markdown
                    content={siteText.positief_geteste_personen.map_toelichting}
                  />
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
