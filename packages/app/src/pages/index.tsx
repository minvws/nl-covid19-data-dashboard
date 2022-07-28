import {
  colors,
  DAY_IN_SECONDS,
  NlHospitalNiceValue,
  NlIntensiveCareNiceValue,
  NlSewerValue,
  NlVaccineCoveragePerAgeGroupEstimated,
  TimeframeOption,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import {
  Arts,
  Chart,
  Chevron,
  Vaccinaties,
  Ziekenhuis,
  RioolwaterMonitoring,
} from '@corona-dashboard/icons';
import { isDefined, isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { LinkWithIcon, Markdown, MaxWidth } from '~/components';
import { CollapsibleButton } from '~/components/collapsible';
import { DataDrivenText } from '~/components/data-driven-text';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout';
import {
  ArticleList,
  HighlightsTile,
  MiniTileSelectorItem,
  MiniTileSelectorLayout,
  MiniTrendTile,
  MiniVaccinationCoverageTile,
  TopicalSectionHeader,
  VaccinationCoverageChoropleth,
} from '~/domain/topical';
import { Search } from '~/domain/topical/components/search';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { useIntl } from '~/intl';
import { getWarning } from '~/queries/get-elements-query';
import { getTopicalPageData } from '~/queries/get-topical-page-data';
import { Languages } from '~/locale';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  selectNlData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import {
  assert,
  countTrailingNullValues,
  useFormatLokalizePercentage,
  cutValuesFromTimeframe,
  useReverseRouter,
  getBoundaryDateStartUnix,
  replaceComponentsInText,
  trimNullValues,
  replaceVariablesInText,
} from '~/utils';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        hospitalText: siteText.pages.hospital_page.nl,
        intensiveCareText: siteText.pages.intensive_care_page.nl,
        sewerText: siteText.pages.sewer_page.shared,
        positiveTestsText: siteText.pages.positive_tests_page.shared,
        textNl: siteText.pages.topical_page.nl,
        textShared: siteText.pages.topical_page.shared,
      }),
      locale
    ),
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
      'booster_coverage',
      'sewer'
    )();

    data.hospital_nice.values = cutValuesFromTimeframe(
      data.hospital_nice.values,
      TimeframeOption.FIVE_WEEKS
    );

    data.tested_overall.values = cutValuesFromTimeframe(
      data.tested_overall.values,
      TimeframeOption.FIVE_WEEKS
    );

    data.intensive_care_nice.values = cutValuesFromTimeframe(
      data.intensive_care_nice.values,
      TimeframeOption.FIVE_WEEKS
    );

    data.sewer.values = cutValuesFromTimeframe(
      data.sewer.values,
      TimeframeOption.FIVE_WEEKS
    );

    return {
      selectedNlData: {
        ...data,
        hospital_nice: {
          ...data.hospital_nice,
          values: cutValuesFromTimeframe(
            data.hospital_nice.values,
            TimeframeOption.FIVE_WEEKS
          ),
        },
        tested_overall: {
          ...data.tested_overall,
          values: cutValuesFromTimeframe(
            data.tested_overall.values,
            TimeframeOption.FIVE_WEEKS
          ),
        },
        intensive_care_nice: {
          ...data.intensive_care_nice,
          values: cutValuesFromTimeframe(
            data.intensive_care_nice.values,
            TimeframeOption.FIVE_WEEKS
          ),
        },
        sewer: {
          ...data.sewer,
          values: cutValuesFromTimeframe(
            data.sewer.values,
            TimeframeOption.FIVE_WEEKS
          ),
        },
      },
    };
  }
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const {
    pageText,
    selectedNlData: data,
    choropleth,
    content,
    lastGenerated,
  } = props;

  const dataSewerTotal = data.sewer;
  const dataICTotal = data.intensive_care_nice;
  const dataHospitalIntake = data.hospital_nice;
  const dataSitemap = useDataSitemap('nl');

  const { commonTexts, ...formatters } = useIntl();
  const reverseRouter = useReverseRouter();
  const { hospitalText, intensiveCareText, textNl, textShared } = pageText;

  const { formatPercentageAsNumber } = useFormatLokalizePercentage();

  const metadata = {
    ...textNl.nationaal_metadata,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const vaccineCoverageEstimatedLastValue =
    data.vaccine_coverage_per_age_group_estimated.last_value;

  const boosterCoverage18PlusValue = data.booster_coverage.values.find(
    (v) => v.age_group === '18+'
  );

  assert(
    boosterCoverage18PlusValue,
    `[${Home.name}] Missing value for booster_coverage 18+`
  );

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
                  textNl.secties.actuele_situatie.titel,
                  {
                    the_netherlands: textNl.the_netherlands,
                  }
                )}
                headingLevel={1}
                text={textShared}
              />

              <MiniTileSelectorLayout
                text={textShared}
                link={{
                  text: textNl.quick_links.header,
                  href: reverseRouter.nl.index(),
                }}
                menuItems={[
                  {
                    label: textNl.mini_trend_tiles.ic_opnames.menu_item_label,
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
                      textNl.mini_trend_tiles.ziekenhuis_opnames
                        .menu_item_label,
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
                    label: textNl.mini_trend_tiles.sewer.menu_item_label,
                    data: dataSewerTotal.values.filter(
                      (x) => typeof x.average === 'number'
                    ),
                    dataProperty: 'average',
                    value: dataSewerTotal.last_value?.average ?? 0,
                    warning: getWarning(content.elements.warning, 'sewer'),
                  } as MiniTileSelectorItem<NlSewerValue>,
                  {
                    label:
                      textNl.mini_trend_tiles.vaccinatiegraad.menu_item_label,
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
                  title={textNl.mini_trend_tiles.ic_opnames.title}
                  text={
                    <>
                      <DataDrivenText
                        data={data}
                        content={[
                          {
                            type: 'metric',
                            text: textNl.data_driven_texts.intensive_care_nice
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
                            text: textShared.secties.kpi.ic_admissions,
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
                        {textNl.mini_trend_tiles.ic_opnames.read_more_link}
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
                        intensiveCareText.linechart_legend_trend_label_moving_average,
                      color: colors.data.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_admission',
                      label: intensiveCareText.linechart_legend_trend_label,
                      color: colors.data.primary,
                    },
                  ]}
                  dataOptions={{
                    timespanAnnotations: [
                      {
                        start: underReportedRangeIntensiveCare,
                        end: Infinity,
                        label: textShared.data_incomplete,
                        shortLabel: commonTexts.common.incomplete,
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
                  title={textNl.mini_trend_tiles.ziekenhuis_opnames.title}
                  text={
                    <>
                      <DataDrivenText
                        data={data}
                        content={[
                          {
                            type: 'metric',
                            text: textNl.data_driven_texts
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
                            text: textShared.secties.kpi.hospital_admissions,
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
                          textNl.mini_trend_tiles.ziekenhuis_opnames
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
                      label: hospitalText.linechart_legend_titel_moving_average,
                      color: colors.data.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_admission',
                      label: hospitalText.linechart_legend_titel_trend_label,
                      color: colors.data.primary,
                    },
                  ]}
                  dataOptions={{
                    timespanAnnotations: [
                      {
                        start: underReportedRangeHospital,
                        end: Infinity,
                        label: textShared.data_incomplete,
                        shortLabel: commonTexts.common.incomplete,
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
                <MiniTrendTile
                  title={textNl.mini_trend_tiles.sewer.title}
                  text={
                    <>
                      <DataDrivenText
                        data={data}
                        content={[
                          {
                            type: 'metric',
                            text: textNl.data_driven_texts.sewer_text.value,
                            metricName: 'sewer',
                            metricProperty: 'average',
                            additionalData: {
                              newDate: formatters.formatDateFromSeconds(
                                data.sewer.last_value.date_unix
                              ),
                            },
                          },
                        ]}
                      />
                      <LinkWithIcon
                        href={reverseRouter.nl.rioolwater()}
                        icon={<Chevron />}
                        iconPlacement="right"
                      >
                        {textNl.mini_trend_tiles.sewer.read_more_link}
                      </LinkWithIcon>
                    </>
                  }
                  icon={<RioolwaterMonitoring />}
                  values={dataSewerTotal.values}
                  seriesConfig={[
                    {
                      type: 'area',
                      metricProperty: 'average',
                      label: commonTexts.common.daggemiddelde,
                      color: colors.data.scale.blue[3],
                    },
                  ]}
                  dataOptions={{
                    valueAnnotation:
                      commonTexts.waarde_annotaties.riool_normalized,
                  }}
                  accessibility={{ key: 'topical_sewer' }}
                  warning={getWarning(content.elements.warning, 'sewer')}
                />
                <MiniVaccinationCoverageTile
                  title={textNl.mini_trend_tiles.vaccinatiegraad.title}
                  oneShotBarLabel={
                    textNl.mini_trend_tiles.vaccinatiegraad.one_shot_bar_label
                  }
                  fullyVaccinatedBarLabel={
                    textNl.mini_trend_tiles.vaccinatiegraad
                      .fully_vaccinated_bar_label
                  }
                  boosterShotAdministeredBarLabel={
                    textNl.mini_trend_tiles.vaccinatiegraad
                      .booster_shots_administered_bar_label
                  }
                  icon={<Vaccinaties />}
                  text={
                    <>
                      <Text variant="datadriven" as="div">
                        <Markdown
                          content={replaceVariablesInText(
                            textNl.mini_trend_tiles.vaccinatiegraad.text,
                            vaccineCoverageEstimatedLastValue as unknown as Record<
                              string,
                              number
                            >,
                            formatters
                          )}
                        />
                        <Markdown
                          content={replaceVariablesInText(
                            textShared.booster_shots_administered_data_drive_text,
                            {
                              percentage: formatters.formatPercentage(
                                boosterCoverage18PlusValue.percentage
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
                        {textNl.mini_trend_tiles.vaccinatiegraad.read_more_link}
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
                    `${boosterCoverage18PlusValue.percentage}`
                  )}
                  warning={getWarning(
                    content.elements.warning,
                    'vaccine_coverage_per_age_group_estimated'
                  )}
                />
              </MiniTileSelectorLayout>
            </Box>

            <Box py={4}>
              <Search title={textShared.secties.search.title.nl} />
            </Box>

            <CollapsibleButton
              label={textShared.overview_links_header}
              icon={<Chart />}
            >
              <Sitemap
                quickLinksHeader={textNl.quick_links.header}
                quickLinks={[
                  {
                    href: reverseRouter.nl.index(),
                    text: textNl.quick_links.links.nationaal,
                  },
                  {
                    href: reverseRouter.vr.index(),
                    text: textNl.quick_links.links.veiligheidsregio,
                  },
                  {
                    href: reverseRouter.gm.index(),
                    text: textNl.quick_links.links.gemeente,
                  },
                ].filter(isDefined)}
                dataSitemapHeader={textNl.data_sitemap_titel}
                dataSitemap={dataSitemap}
              />
            </CollapsibleButton>

            {isPresent(content.highlights) && (
              <HighlightsTile
                hiddenTitle={textNl.highlighted_items.title}
                weeklyHighlight={content.weeklyHighlight}
                highlights={content.highlights}
                showWeeklyHighlight={content.showWeeklyHighlight}
                text={textShared}
              />
            )}

            <VaccinationCoverageChoropleth
              title={
                textShared.secties.vaccination_coverage_choropleth.title.nl
              }
              content={
                textShared.secties.vaccination_coverage_choropleth.content.nl
              }
              data={{
                gm: choropleth.gm.vaccine_coverage_per_age_group,
                vr: choropleth.vr.vaccine_coverage_per_age_group,
              }}
              link={{
                href: reverseRouter.nl.vaccinaties(),
                text: textShared.secties.vaccination_coverage_choropleth
                  .link_text.nl,
              }}
              text={textShared}
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
              title={textShared.secties.meer_lezen.titel}
              description={textShared.secties.meer_lezen.omschrijving}
              link={textShared.secties.meer_lezen.link}
              headerVariant="h2"
              text={textShared}
            />

            {isPresent(content.articles) && (
              <ArticleList
                articles={content.articles as any}
                text={textShared}
              />
            )}
          </MaxWidth>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
