import { Arts, Chart, Vaccinaties, Ziekenhuis } from '@corona-dashboard/icons';
import { isDefined } from 'ts-is-present';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { CollapsibleButton } from '~/components/collapsible';
import { DataDrivenText } from '~/components/data-driven-text/data-driven-text';
import { HighlightTeaserProps } from '~/components/highlight-teaser';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { TileList } from '~/components/tile-list';
import { VaccinationCoverageChoropleth } from '~/domain/actueel/vaccination-coverage-choropleth';
import { EscalationLevelType } from '~/domain/escalation-level/common';
import { EscalationLevelBanner } from '~/domain/escalation-level/escalation-level-banner';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
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
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
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
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { trimNullValues } from '~/utils/trim-null-values';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({
      escalation_levels,
      tested_overall,
      vaccine_coverage_per_age_group,
    }) => ({
      escalation_levels,
      tested_overall,
      vaccine_coverage_per_age_group: isDefined(vaccine_coverage_per_age_group)
        ? selectVaccineCoverageData(vaccine_coverage_per_age_group)
        : vaccine_coverage_per_age_group ?? null,
    }),
    gm: ({ tested_overall, vaccine_coverage_per_age_group }) => ({
      tested_overall,
      vaccine_coverage_per_age_group: isDefined(vaccine_coverage_per_age_group)
        ? selectVaccineCoverageData(vaccine_coverage_per_age_group)
        : vaccine_coverage_per_age_group ?? null,
    }),
  }),
  createGetContent<{
    showWeeklyHighlight: boolean;
    articles?: ArticleSummary[];
    weeklyHighlight?: WeeklyHighlightProps;
    highlights?: HighlightTeaserProps[];
    riskLevel: {
      dateFrom: string;
      level: EscalationLevelType;
    };
    elements: ElementsQueryResult;
  }>(getTopicalPageQuery),
  selectNlData(
    'intensive_care_nice',
    'intensive_care_lcps',
    'hospital_nice',
    'hospital_lcps',
    'difference',
    'vaccine_administered_total',
    'vaccine_coverage_per_age_group_estimated'
  )
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;

  const dataICTotal = data.intensive_care_nice;
  const dataHospitalIntake = data.hospital_nice;
  const dataSitemap = useDataSitemap('nl');

  const { siteText, ...formatters } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.nationaal_actueel;

  const internationalFeature = useFeature('inPositiveTestsPage');

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const vaccineCoverageEstimatedLastValue =
    data.vaccine_coverage_per_age_group_estimated.last_value;

  const underReportedRangeIntensiveCare = getBoundaryDateStartUnix(
    data.intensive_care_nice.values,
    countTrailingNullValues(
      data.intensive_care_nice.values,
      'admissions_on_date_of_admission_moving_average_rounded'
    )
  );

  const underReportedRangeHospital = getBoundaryDateStartUnix(
    data.hospital_nice.values,
    countTrailingNullValues(
      data.hospital_nice.values,
      'admissions_on_date_of_admission_moving_average_rounded'
    )
  );

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
                    content={[
                      {
                        type: 'metric',
                        text: text.data_driven_texts.intensive_care_nice.value,
                        metricName: 'intensive_care_nice',
                        metricProperty:
                          'admissions_on_date_of_admission_moving_average_rounded',
                        differenceKey:
                          'intensive_care_nice__admissions_on_date_of_reporting_moving_average',
                      },
                      {
                        type: 'metric',
                        text: siteText.common_actueel.secties.kpi.ic_admissions,
                        metricName: 'intensive_care_lcps',
                        metricProperty: 'beds_occupied_covid',
                        differenceKey:
                          'intensive_care_lcps__beds_occupied_covid',
                      },
                    ]}
                  />
                }
                icon={<Arts />}
                values={dataICTotal.values}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty:
                      'admissions_on_date_of_admission_moving_average_rounded',
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
                    noMarker: true,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedRangeIntensiveCare,
                      end: Infinity,
                      label: siteText.common_actueel.data_incomplete,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'admissions_on_date_of_admission_moving_average_rounded',
                      ],
                    },
                  ],
                }}
                titleValue={
                  dataICTotal.last_value
                    ?.admissions_on_date_of_admission_moving_average_rounded ??
                  0
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
                    content={[
                      {
                        type: 'metric',
                        text: text.data_driven_texts.intake_hospital_ma_nieuw
                          .value,
                        metricName: 'hospital_nice',
                        metricProperty:
                          'admissions_on_date_of_admission_moving_average_rounded',
                        differenceKey:
                          'hospital_nice__admissions_on_date_of_reporting_moving_average',
                      },
                      {
                        type: 'metric',
                        text: siteText.common_actueel.secties.kpi
                          .hospital_admissions,
                        metricName: 'hospital_lcps',
                        metricProperty: 'beds_occupied_covid',
                        differenceKey: 'hospital_lcps__beds_occupied_covid',
                      },
                    ]}
                  />
                }
                icon={<Ziekenhuis />}
                values={dataHospitalIntake.values}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty:
                      'admissions_on_date_of_admission_moving_average_rounded',
                    label:
                      siteText.ziekenhuisopnames_per_dag
                        .linechart_legend_titel_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'area',
                    metricProperty: 'admissions_on_date_of_admission',
                    label:
                      siteText.ziekenhuisopnames_per_dag
                        .linechart_legend_titel_trend_label,
                    color: colors.data.primary,
                    curve: 'step',
                    strokeWidth: 0,
                    noMarker: true,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedRangeHospital,
                      end: Infinity,
                      label: siteText.common_actueel.data_incomplete,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'admissions_on_date_of_admission_moving_average_rounded',
                      ],
                    },
                  ],
                }}
                titleValue={
                  dataHospitalIntake.last_value
                    ?.admissions_on_date_of_admission_moving_average_rounded ??
                  0
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
                  vaccineCoverageEstimatedLastValue.age_18_plus_fully_vaccinated
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

            <EscalationLevelBanner
              level={content.riskLevel.level}
              dateFrom={content.riskLevel.dateFrom}
            />

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

            <VaccinationCoverageChoropleth
              title={
                siteText.common_actueel.secties.vaccination_coverage_choropleth
                  .title.nl
              }
              content={
                siteText.common_actueel.secties.vaccination_coverage_choropleth
                  .content.nl
              }
              data={{
                gm: choropleth.gm.vaccine_coverage_per_age_group,
                vr: choropleth.vr.vaccine_coverage_per_age_group,
              }}
            />

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
