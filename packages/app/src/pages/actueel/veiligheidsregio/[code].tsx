import {
  colors,
  DAY_IN_SECONDS,
  GmCollectionVaccineCoveragePerAgeGroup,
  VrHospitalNiceValue,
  VrVaccineCoveragePerAgeGroupValue,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Chevron, Vaccinaties, Ziekenhuis } from '@corona-dashboard/icons';
import { useRouter } from 'next/router';
import { isDefined, isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { CollapsibleButton } from '~/components/collapsible';
import { ContentTeaserProps } from '~/components/content-teaser';
import { DataDrivenText } from '~/components/data-driven-text';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { Text } from '~/components/typography';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { VaccinationCoverageChoropleth } from '~/domain/actueel/vaccination-coverage-choropleth';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { Search } from '~/domain/topical/components/search';
import {
  MiniTileSelectorItem,
  MiniTileSelectorLayout,
} from '~/domain/topical/mini-tile-selector-layout';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniVaccinationCoverageTile } from '~/domain/topical/mini-vaccination-coverage-tile';
import { TopicalSectionHeader } from '~/domain/topical/topical-section-header';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { useAgegroupLabels } from '~/domain/vaccine/logic/use-agegroup-labels';
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
  selectVrData,
} from '~/static-props/get-data';
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';
import { cutValuesFromTimeframe } from '~/utils/cut-values-from-timeframe';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { trimNullValues } from '~/utils/trim-null-values';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,

  (context) => {
    const data = selectVrData(
      'vaccine_coverage_per_age_group',
      'hospital_nice',
      'code',
      'difference'
    )(context);

    data.selectedVrData.hospital_nice.values = cutValuesFromTimeframe(
      data.selectedVrData.hospital_nice.values,
      '5weeks'
    );

    return data;
  },
  createGetChoroplethData({
    gm: ({ vaccine_coverage_per_age_group }, ctx) => {
      if (!isDefined(vaccine_coverage_per_age_group)) {
        return {
          vaccine_coverage_per_age_group:
            null as unknown as GmCollectionVaccineCoveragePerAgeGroup[],
        };
      }

      return {
        vaccine_coverage_per_age_group: selectVaccineCoverageData(
          isPresent(ctx.params?.code)
            ? vaccine_coverage_per_age_group.filter((el) =>
                gmCodesByVrCode[ctx.params?.code as string].includes(el.gmcode)
              )
            : vaccine_coverage_per_age_group
        ),
      };
    },
  }),
  createGetContent<{
    articles: ContentTeaserProps[];
    elements: ElementsQueryResult;
  }>(
    getTopicalPageQuery('vr', [
      'hospital_nice',
      'vaccine_coverage_per_age_group',
    ])
  )
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
  const vrCode = router.query.code as string;
  const { siteText, ...formatters } = useIntl();
  const text = siteText.veiligheidsregio_actueel;

  const dataHospitalIntake = data.hospital_nice;
  const dataSitemap = useDataSitemap('vr', vrCode);

  const filteredAgeGroup18Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (item) => item.age_group_range === '18+'
    );
  const renderedAgeGroup18Pluslabels = useAgegroupLabels(
    filteredAgeGroup18Plus,
    true
  );

  const internationalFeature = useFeature('inPositiveTestsPage');

  const metadata = {
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  const underReportedRangeHospital = getBoundaryDateStartUnix(
    data.hospital_nice.values,
    countTrailingNullValues(
      data.hospital_nice.values,
      'admissions_on_date_of_admission_moving_average_rounded'
    )
  );

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
            px={{ _: 3, sm: 5 }}
          >
            <Box spacing={3}>
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
              />

              <MiniTileSelectorLayout
                link={{
                  text: replaceVariablesInText(text.title_link, {
                    safetyRegionName: vrName,
                  }),
                  href: reverseRouter.vr.index(vrCode),
                }}
                menuItems={[
                  {
                    label:
                      siteText.veiligheidsregio_actueel.mini_trend_tiles
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
                  } as MiniTileSelectorItem<VrHospitalNiceValue>,
                  {
                    label:
                      siteText.veiligheidsregio_actueel.mini_trend_tiles
                        .vaccinatiegraad.menu_item_label,
                    data: data.vaccine_coverage_per_age_group.values,
                    dataProperty: 'fully_vaccinated_percentage',
                    value:
                      renderedAgeGroup18Pluslabels.fully_vaccinated_percentage,
                    valueIsPercentage: true,
                    warning: getWarning(
                      content.elements.warning,
                      'vaccinatiegraad'
                    ),
                    hideSparkBar:
                      data.vaccine_coverage_per_age_group.values.length < 7,
                  } as MiniTileSelectorItem<VrVaccineCoveragePerAgeGroupValue>,
                ]}
              >
                <MiniTrendTile
                  title={text.mini_trend_tiles.ziekenhuis_opnames.title}
                  text={
                    <>
                      <DataDrivenText
                        data={data}
                        content={[
                          {
                            type: 'metric',
                            text: text.data_driven_texts.intake_hospital_ma
                              .value,
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
                        ]}
                      />
                      <LinkWithIcon
                        href={reverseRouter.vr.ziekenhuisopnames(vrCode)}
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
                        siteText.ziekenhuisopnames_per_dag
                          .linechart_legend_titel_moving_average,
                      color: colors.data.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_reporting',
                      label:
                        siteText.ziekenhuisopnames_per_dag
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

                {isDefined(filteredAgeGroup18Plus) && (
                  <MiniVaccinationCoverageTile
                    title={text.mini_trend_tiles.vaccinatiegraad.title}
                    oneShotBarLabel={
                      text.mini_trend_tiles.vaccinatiegraad.one_shot_bar_label
                    }
                    fullyVaccinatedBarLabel={
                      text.mini_trend_tiles.vaccinatiegraad
                        .fully_vaccinated_bar_label
                    }
                    icon={<Vaccinaties />}
                    text={
                      <>
                        <Text variant="datadriven" as="div">
                          <Markdown
                            content={replaceVariablesInText(
                              text.mini_trend_tiles.vaccinatiegraad.text,
                              renderedAgeGroup18Pluslabels,
                              formatters
                            )}
                          />
                        </Text>
                        <LinkWithIcon
                          href={reverseRouter.vr.vaccinaties(vrCode)}
                          icon={<Chevron />}
                          iconPlacement="right"
                        >
                          {text.mini_trend_tiles.vaccinatiegraad.read_more_link}
                        </LinkWithIcon>
                      </>
                    }
                    oneShotPercentage={
                      filteredAgeGroup18Plus.has_one_shot_percentage
                    }
                    fullyVaccinatedPercentage={
                      filteredAgeGroup18Plus.fully_vaccinated_percentage
                    }
                    oneShotPercentageLabel={
                      filteredAgeGroup18Plus.has_one_shot_percentage_label
                    }
                    fullyVaccinatedPercentageLabel={
                      filteredAgeGroup18Plus.fully_vaccinated_percentage_label
                    }
                    warning={getWarning(
                      content.elements.warning,
                      'vaccine_coverage_per_age_group'
                    )}
                  />
                )}
              </MiniTileSelectorLayout>
            </Box>

            <Box pt={4}>
              <Search title={siteText.common_actueel.secties.search.title.vr} />
            </Box>

            <VaccinationCoverageChoropleth
              title={replaceVariablesInText(
                siteText.common_actueel.secties.vaccination_coverage_choropleth
                  .title.vr,
                { safetyRegion: vrName }
              )}
              content={replaceVariablesInText(
                siteText.common_actueel.secties.vaccination_coverage_choropleth
                  .content.vr,
                { safetyRegion: vrName }
              )}
              vrCode={vrCode}
              data={{ gm: choropleth.gm.vaccine_coverage_per_age_group }}
              link={{
                href: reverseRouter.vr.vaccinaties(vrCode),
                text: replaceVariablesInText(
                  siteText.common_actueel.secties
                    .vaccination_coverage_choropleth.link_text.vr,
                  { safetyRegion: vrName }
                ),
              }}
            />

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

            <ArticleList articles={content.articles} />
          </MaxWidth>
        </Box>
      </Box>
    </Layout>
  );
};

export default TopicalVr;
