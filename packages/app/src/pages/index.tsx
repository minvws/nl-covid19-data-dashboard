import {
  GmCollectionTestedOverall,
  VrCollectionTestedOverall,
} from '@corona-dashboard/common';
import { Arts, Chart, Vaccinaties, Ziekenhuis } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { last } from 'lodash';
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
import { MiniTileLayout } from '~/domain/topical/mini-tile-layout';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniVaccinationCoverageTile } from '~/domain/topical/mini-vaccination-coverage-tile';
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
import { colors } from '~/style/theme';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
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
    'intensive_care_nice',
    'hospital_nice',
    'difference',
    'vaccine_administered_total',
    'vaccine_coverage_per_age_group_estimated'
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

  const dataICTotal = data.intensive_care_nice;
  const dataHospitalIntake = data.hospital_nice;
  const dataSitemap = useDataSitemap('nl');

  const { siteText, ...formatters } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.nationaal_actueel;

  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');

  const internationalFeature = useFeature('inPositiveTestsPage');

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const vaccineCoverageEstimatedLastValue =
    data.vaccine_coverage_per_age_group_estimated.last_value;

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

            <MiniTileLayout id="metric-navigation">
              <MiniTrendTile
                title={text.mini_trend_tiles.ic_opnames.title}
                text={
                  <DataDrivenText
                    data={data}
                    metricName="intensive_care_nice"
                    metricProperty="admissions_on_date_of_admission_moving_average"
                    differenceKey="intensive_care_nice__admissions_on_date_of_reporting_moving_average"
                    valueTexts={
                      text.data_driven_texts.intensive_care_nice.value
                    }
                    differenceText={
                      siteText.common_actueel.secties.kpi.zeven_daags_gemiddelde
                    }
                    isAmount
                  />
                }
                icon={<Arts />}
                values={dataICTotal.values}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty:
                      'admissions_on_date_of_admission_moving_average',
                    label:
                      siteText.ic_opnames_per_dag
                        .linechart_legend_trend_label_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'area',
                    metricProperty: 'admissions_on_date_of_admission',
                    label:
                      siteText.ic_opnames_per_dag.linechart_legend_trend_label,
                    color: colors.data.primary,
                    curve: 'step',
                    strokeWidth: 0,
                  },
                ]}
                titleValue={
                  last(dataICTotal.values)
                    ?.admissions_on_date_of_admission_moving_average ?? 0
                }
                href={reverseRouter.nl.intensiveCareOpnames()}
                accessibility={{ key: 'topical_intensive_care_nice' }}
                warning={getWarning(
                  content.elements.timeSeries,
                  'intensive_care_nice'
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
                values={dataHospitalIntake.values}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty:
                      'admissions_on_date_of_admission_moving_average',
                    label:
                      siteText.ziekenhuisopnames_per_dag
                        .linechart_legend_titel_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'area',
                    metricProperty: 'admissions_on_date_of_reporting',
                    label:
                      siteText.ziekenhuisopnames_per_dag
                        .linechart_legend_titel_trend_label,
                    color: colors.data.primary,
                    curve: 'step',
                    strokeWidth: 0,
                  },
                ]}
                titleValue={
                  last(dataHospitalIntake.values)
                    ?.admissions_on_date_of_admission_moving_average ?? 0
                }
                href={reverseRouter.nl.ziekenhuisopnames()}
                accessibility={{ key: 'topical_hospital_nice' }}
                warning={getWarning(
                  content.elements.timeSeries,
                  'hospital_nice'
                )}
              />

              <MiniVaccinationCoverageTile
                title={text.mini_trend_tiles.vaccinatiegraad.title}
                href={reverseRouter.nl.vaccinaties()}
                icon={<Vaccinaties />}
                text={
                  <Markdown
                    content={replaceVariablesInText(
                      text.mini_trend_tiles.vaccinatiegraad.text,
                      vaccineCoverageEstimatedLastValue as unknown as Record<
                        string,
                        number
                      >,
                      formatters
                    )}
                  />
                }
                titleValue={
                  vaccineCoverageEstimatedLastValue.age_18_plus_has_one_shot
                }
                titleValueIsPercentage
                oneShotPercentage={
                  vaccineCoverageEstimatedLastValue.age_18_plus_has_one_shot
                }
                fullyVaccinatedPercentage={
                  vaccineCoverageEstimatedLastValue.age_18_plus_fully_vaccinated
                }
              />
            </MiniTileLayout>

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
