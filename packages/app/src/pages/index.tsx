import {
  colors,
  DAY_IN_SECONDS,
  NlHospitalNiceValue,
  NlIntensiveCareNiceValue,
  NlTestedOverallValue,
  NlVaccineCoveragePerAgeGroupEstimated,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import {
  Arts,
  Chart,
  Chevron,
  Test,
  Vaccinaties,
  Ziekenhuis,
} from '@corona-dashboard/icons';
import { isDefined, isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { CollapsibleButton } from '~/components/collapsible';
import { DataDrivenText } from '~/components/data-driven-text';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { Text } from '~/components/typography';
import { VaccinationCoverageChoropleth } from '~/domain/actueel/vaccination-coverage-choropleth';
import { EscalationLevelBanner } from '~/domain/escalation-level/escalation-level-banner';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { Search } from '~/domain/topical/components/search';
import { HighlightsTile } from '~/domain/topical/highlights-tile';
import {
  MiniTileSelectorItem,
  MiniTileSelectorLayout,
} from '~/domain/topical/mini-tile-selector-layout';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniVaccinationCoverageTile } from '~/domain/topical/mini-vaccination-coverage-tile';
import { TopicalSectionHeader } from '~/domain/topical/topical-section-header';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { getWarning } from '~/queries/get-elements-query';
import { getTopicalPageData } from '~/queries/get-topical-page-data';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';
import { cutValuesFromTimeframe } from '~/utils/cut-values-from-timeframe';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { trimNullValues } from '~/utils/trim-null-values';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useFormatLokalizePercentage } from '~/utils/use-format-lokalize-percentage';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({ tested_overall, vaccine_coverage_per_age_group }) => ({
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
  getTopicalPageData('nl', [
    'intensive_care_nice',
    'hospital_nice',
    'tested_overall',
    'vaccine_administered_total',
    'vaccine_coverage_per_age_group_estimated',
  ]),
  () => {
    const { selectedNlData: data } = selectNlData(
      'intensive_care_nice',
      'intensive_care_lcps',
      'hospital_nice',
      'tested_overall',
      'tested_ggd',
      'hospital_lcps',
      'difference',
      'vaccine_administered_total',
      'vaccine_coverage_per_age_group_estimated',
      'risk_level',
      'booster_coverage'
    )();

    data.hospital_nice.values = cutValuesFromTimeframe(
      data.hospital_nice.values,
      '5weeks'
    );

    data.tested_overall.values = cutValuesFromTimeframe(
      data.tested_overall.values,
      '5weeks'
    );

    data.intensive_care_nice.values = cutValuesFromTimeframe(
      data.intensive_care_nice.values,
      '5weeks'
    );

    return { selectedNlData: data };
  }
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;

  const dataICTotal = data.intensive_care_nice;
  const dataHospitalIntake = data.hospital_nice;
  const dataTestedOverall = data.tested_overall;
  const dataSitemap = useDataSitemap('nl');

  const { siteText, ...formatters } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.nationaal_actueel;

  const { formatPercentageAsNumber } = useFormatLokalizePercentage();

  const { formatPercentage } = useIntl();

  const internationalFeature = useFeature('inPositiveTestsPage');

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const vaccineCoverageEstimatedLastValue =
    data.vaccine_coverage_per_age_group_estimated.last_value;

  const boosterCoverageLastValue = data.booster_coverage?.last_value;

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

  const sevenDayAverageDatesIntensiveCare: [number, number] = [
    underReportedRangeIntensiveCare - WEEK_IN_SECONDS,
    underReportedRangeIntensiveCare - DAY_IN_SECONDS,
  ];

  const sevenDayAverageDatesHospital: [number, number] = [
    underReportedRangeHospital - WEEK_IN_SECONDS,
    underReportedRangeHospital - DAY_IN_SECONDS,
  ];

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg="white">
        <MaxWidth id="content">
          <Box
            spacing={{ _: 4, md: 5 }}
            pt={{ _: 3, md: 5 }}
            px={{ _: 3, sm: 4 }}
          >
            <Box spacing={3}>
              <TopicalSectionHeader
                lastGenerated={Number(lastGenerated)}
                title={replaceComponentsInText(
                  text.secties.actuele_situatie.titel,
                  {
                    the_netherlands: text.the_netherlands,
                  }
                )}
                headingLevel={1}
              />

              <MiniTileSelectorLayout
                link={{
                  text: text.quick_links.header,
                  href: reverseRouter.nl.index(),
                }}
                menuItems={[
                  {
                    label:
                      siteText.nationaal_actueel.mini_trend_tiles.ic_opnames
                        .menu_item_label,
                    data: trimNullValues(
                      dataICTotal.values,
                      'admissions_on_date_of_admission_moving_average_rounded'
                    ),
                    dataProperty:
                      'admissions_on_date_of_admission_moving_average_rounded',
                    value:
                      dataICTotal.last_value
                        ?.admissions_on_date_of_admission_moving_average_rounded ??
                      0,
                    warning: getWarning(
                      content.elements.warning,
                      'intensive_care_nice'
                    ),
                  } as MiniTileSelectorItem<NlIntensiveCareNiceValue>,
                  {
                    label:
                      siteText.nationaal_actueel.mini_trend_tiles
                        .ziekenhuis_opnames.menu_item_label,
                    data: trimNullValues(
                      dataHospitalIntake.values,
                      'admissions_on_date_of_admission_moving_average_rounded'
                    ),
                    dataProperty:
                      'admissions_on_date_of_admission_moving_average_rounded',
                    value:
                      dataHospitalIntake.last_value
                        ?.admissions_on_date_of_admission_moving_average_rounded ??
                      0,
                    warning: getWarning(
                      content.elements.warning,
                      'hospital_nice'
                    ),
                  } as MiniTileSelectorItem<NlHospitalNiceValue>,
                  {
                    label:
                      siteText.nationaal_actueel.mini_trend_tiles
                        .positief_geteste_mensen.menu_item_label,
                    data: dataTestedOverall.values,
                    dataProperty: 'infected_moving_average_rounded',
                    value:
                      dataTestedOverall.last_value
                        .infected_moving_average_rounded,
                    warning: getWarning(
                      content.elements.warning,
                      'tested_overall'
                    ),
                  } as MiniTileSelectorItem<NlTestedOverallValue>,
                  {
                    label:
                      siteText.nationaal_actueel.mini_trend_tiles
                        .vaccinatiegraad.menu_item_label,
                    data: data.vaccine_coverage_per_age_group_estimated.values,
                    dataProperty: 'age_18_plus_fully_vaccinated',
                    value:
                      data.vaccine_coverage_per_age_group_estimated.last_value
                        ?.age_18_plus_fully_vaccinated,
                    valueIsPercentage: true,
                    warning: getWarning(
                      content.elements.warning,
                      'vaccine_coverage_per_age_group_estimated'
                    ),
                    percentageBar: {
                      value:
                        data.vaccine_coverage_per_age_group_estimated.last_value
                          ?.age_18_plus_fully_vaccinated,
                    },
                  } as MiniTileSelectorItem<NlVaccineCoveragePerAgeGroupEstimated>,
                ].filter((x) => x !== undefined)}
              >
                <MiniTrendTile
                  title={text.mini_trend_tiles.ic_opnames.title}
                  text={
                    <>
                      <DataDrivenText
                        data={data}
                        content={[
                          {
                            type: 'metric',
                            text: text.data_driven_texts.intensive_care_nice
                              .value,
                            metricName: 'intensive_care_nice',
                            metricProperty:
                              'admissions_on_date_of_admission_moving_average_rounded',
                            differenceKey:
                              'intensive_care_nice__admissions_on_date_of_reporting_moving_average',
                            additionalData: {
                              dateStart: formatters.formatDateFromSeconds(
                                sevenDayAverageDatesIntensiveCare[0]
                              ),
                              dateEnd: formatters.formatDateFromSeconds(
                                sevenDayAverageDatesIntensiveCare[1]
                              ),
                            },
                          },
                          {
                            type: 'metric',
                            text: siteText.common_actueel.secties.kpi
                              .ic_admissions,
                            metricName: 'intensive_care_lcps',
                            metricProperty: 'beds_occupied_covid',
                            differenceKey:
                              'intensive_care_lcps__beds_occupied_covid',
                          },
                        ]}
                      />
                      <LinkWithIcon
                        href={reverseRouter.nl.intensiveCareOpnames()}
                        icon={<Chevron />}
                        iconPlacement="right"
                      >
                        {text.mini_trend_tiles.ic_opnames.read_more_link}
                      </LinkWithIcon>
                    </>
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
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_admission',
                      label:
                        siteText.ic_opnames_per_dag
                          .linechart_legend_trend_label,
                      color: colors.data.primary,
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
                          'admissions_on_date_of_admission_moving_average',
                        ],
                      },
                    ],
                  }}
                  accessibility={{ key: 'topical_intensive_care_nice' }}
                  warning={getWarning(
                    content.elements.warning,
                    'intensive_care_nice'
                  )}
                />

                <MiniTrendTile
                  title={text.mini_trend_tiles.ziekenhuis_opnames.title}
                  text={
                    <>
                      <DataDrivenText
                        data={data}
                        content={[
                          {
                            type: 'metric',
                            text: text.data_driven_texts
                              .intake_hospital_ma_nieuw.value,
                            metricName: 'hospital_nice',
                            metricProperty:
                              'admissions_on_date_of_admission_moving_average_rounded',
                            differenceKey:
                              'hospital_nice__admissions_on_date_of_reporting_moving_average',
                            additionalData: {
                              dateStart: formatters.formatDateFromSeconds(
                                sevenDayAverageDatesHospital[0]
                              ),
                              dateEnd: formatters.formatDateFromSeconds(
                                sevenDayAverageDatesHospital[1]
                              ),
                            },
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
                      <LinkWithIcon
                        href={reverseRouter.nl.ziekenhuisopnames()}
                        icon={<Chevron />}
                        iconPlacement="right"
                      >
                        {
                          text.mini_trend_tiles.ziekenhuis_opnames
                            .read_more_link
                        }
                      </LinkWithIcon>
                    </>
                  }
                  icon={<Ziekenhuis />}
                  values={dataHospitalIntake.values}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty:
                        'admissions_on_date_of_admission_moving_average',
                      label:
                        siteText.pages.hospitalPage.nl
                          .linechart_legend_titel_moving_average,
                      color: colors.data.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_admission',
                      label:
                        siteText.pages.hospitalPage.nl
                          .linechart_legend_titel_trend_label,
                      color: colors.data.primary,
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
                          'admissions_on_date_of_admission_moving_average',
                        ],
                      },
                    ],
                  }}
                  accessibility={{ key: 'topical_hospital_nice' }}
                  warning={getWarning(
                    content.elements.warning,
                    'hospital_nice'
                  )}
                />
                {
                  <MiniTrendTile
                    title={text.mini_trend_tiles.positief_geteste_mensen.title}
                    text={
                      <>
                        <DataDrivenText
                          data={data}
                          content={[
                            {
                              type: 'metric',
                              text: text.data_driven_texts.tested_overall.value,
                              metricName: 'tested_overall',
                              metricProperty: 'infected_moving_average_rounded',
                              additionalData: {
                                dateStart: formatters.formatDateFromSeconds(
                                  data.tested_overall.last_value.date_unix -
                                    WEEK_IN_SECONDS
                                ),
                                dateEnd: formatters.formatDateFromSeconds(
                                  data.tested_overall.last_value.date_unix
                                ),
                              },
                            },
                            {
                              type: 'metric',
                              text: text.data_driven_texts.tested_ggd.value,
                              metricName: 'tested_ggd',
                              isPercentage: true,
                              metricProperty:
                                'infected_percentage_moving_average',
                            },
                          ]}
                        />
                        <LinkWithIcon
                          href={reverseRouter.nl.positiefGetesteMensen()}
                          icon={<Chevron />}
                          iconPlacement="right"
                        >
                          {
                            text.mini_trend_tiles.positief_geteste_mensen
                              .read_more_link
                          }
                        </LinkWithIcon>
                      </>
                    }
                    icon={<Test />}
                    values={dataTestedOverall.values}
                    seriesConfig={[
                      {
                        type: 'line',
                        metricProperty: 'infected_moving_average',
                        label:
                          siteText.positief_geteste_personen.tooltip_labels
                            .infected_moving_average,
                        color: colors.data.primary,
                      },
                      {
                        type: 'bar',
                        metricProperty: 'infected',
                        label:
                          siteText.positief_geteste_personen.tooltip_labels
                            .infected_overall,
                        color: colors.data.primary,
                      },
                    ]}
                    accessibility={{
                      key: 'topical_tested_overall_infected',
                    }}
                    warning={getWarning(
                      content.elements.warning,
                      'tested_overall'
                    )}
                    dataOptions={{
                      forcedMaximumValue: 150000,
                      outOfBoundsConfig: {
                        label:
                          siteText.positief_geteste_personen.tooltip_labels
                            .infected_out_of_bounds,
                        tooltipLabel:
                          siteText.positief_geteste_personen.tooltip_labels
                            .annotations,
                        checkIsOutofBounds: (
                          x: NlTestedOverallValue,
                          max: number
                        ) => x.infected > max,
                      },
                    }}
                  />
                }
                <MiniVaccinationCoverageTile
                  title={text.mini_trend_tiles.vaccinatiegraad.title}
                  oneShotBarLabel={
                    text.mini_trend_tiles.vaccinatiegraad.one_shot_bar_label
                  }
                  fullyVaccinatedBarLabel={
                    text.mini_trend_tiles.vaccinatiegraad
                      .fully_vaccinated_bar_label
                  }
                  boosterShotAdministeredBarLabel={
                    text.mini_trend_tiles.vaccinatiegraad
                      .booster_shots_administered_bar_label
                  }
                  icon={<Vaccinaties />}
                  text={
                    <>
                      <Text variant="datadriven" as="div">
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
                        <Markdown
                          content={replaceVariablesInText(
                            siteText.common_actueel
                              .booster_shots_administered_data_drive_text,
                            {
                              percentage: formatPercentage(
                                boosterCoverageLastValue.percentage
                              ),
                            }
                          )}
                        />
                      </Text>
                      <LinkWithIcon
                        href={reverseRouter.nl.vaccinaties()}
                        icon={<Chevron />}
                        iconPlacement="right"
                      >
                        {text.mini_trend_tiles.vaccinatiegraad.read_more_link}
                      </LinkWithIcon>
                    </>
                  }
                  oneShotPercentage={
                    vaccineCoverageEstimatedLastValue.age_18_plus_has_one_shot
                  }
                  fullyVaccinatedPercentage={
                    vaccineCoverageEstimatedLastValue.age_18_plus_fully_vaccinated
                  }
                  boosterShotAdministered={formatPercentageAsNumber(
                    `${boosterCoverageLastValue.percentage}`
                  )}
                  warning={getWarning(
                    content.elements.warning,
                    'vaccine_coverage_per_age_group_estimated'
                  )}
                />
              </MiniTileSelectorLayout>
            </Box>

            <Box py={4}>
              <Search title={siteText.common_actueel.secties.search.title.nl} />
            </Box>

            <EscalationLevelBanner data={data.risk_level.last_value} hasLink />

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

            {isPresent(content.highlights) && (
              <HighlightsTile
                hiddenTitle={text.highlighted_items.title}
                weeklyHighlight={content.weeklyHighlight}
                highlights={content.highlights}
                showWeeklyHighlight={content.showWeeklyHighlight}
              />
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
              link={{
                href: reverseRouter.nl.vaccinaties(),
                text: siteText.common_actueel.secties
                  .vaccination_coverage_choropleth.link_text.nl,
              }}
            />
          </Box>
        </MaxWidth>

        <Spacer mb={5} />

        <Box width="100%" backgroundColor="offWhite" pb={5}>
          <MaxWidth
            spacing={4}
            pt={{ _: 3, md: 5 }}
            px={{ _: 3, sm: 4, md: 3, lg: 4 }}
          >
            <TopicalSectionHeader
              title={siteText.common_actueel.secties.meer_lezen.titel}
              description={
                siteText.common_actueel.secties.meer_lezen.omschrijving
              }
              link={siteText.common_actueel.secties.meer_lezen.link}
              headerVariant="h2"
            />

            {isPresent(content.articles) && (
              <ArticleList articles={content.articles as any} />
            )}
          </MaxWidth>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
