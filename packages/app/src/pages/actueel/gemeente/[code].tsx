import {
  colors,
  DAY_IN_SECONDS,
  GmCollectionVaccineCoveragePerAgeGroup,
  GmHospitalNiceValue,
  GmVaccineCoveragePerAgeGroupValue,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Vaccinaties, Ziekenhuis } from '@corona-dashboard/icons';
import { useRouter } from 'next/router';
import { isDefined, isPresent } from 'ts-is-present';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box, Spacer } from '~/components/base';
import { CollapsibleButton } from '~/components/collapsible';
import { ContentTeaserProps } from '~/components/content-teaser';
import { DataDrivenText } from '~/components/data-driven-text';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { TileList } from '~/components/tile-list';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';
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
  selectGmData,
} from '~/static-props/get-data';
import { assert } from '~/utils/assert';
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { getVrForMunicipalityCode } from '~/utils/get-vr-for-municipality-code';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { trimNullValues } from '~/utils/trim-null-values';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectGmData(
    'hospital_nice',
    'sewer',
    'difference',
    'vaccine_coverage_per_age_group'
  ),
  createGetChoroplethData({
    gm: ({ vaccine_coverage_per_age_group }, ctx) => {
      if (!isDefined(vaccine_coverage_per_age_group)) {
        return {
          vaccine_coverage_per_age_group:
            null as unknown as GmCollectionVaccineCoveragePerAgeGroup[],
        };
      }
      const vrCode = isPresent(ctx.params?.code)
        ? vrCodeByGmCode[ctx.params?.code as 'string']
        : undefined;

      return {
        vaccine_coverage_per_age_group: selectVaccineCoverageData(
          isDefined(vrCode)
            ? vaccine_coverage_per_age_group.filter((el) =>
                gmCodesByVrCode[vrCode].includes(el.gmcode)
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
    getTopicalPageQuery('gm', [
      'hospital_nice',
      'vaccine_coverage_per_age_group',
    ])
  )
);

const TopicalMunicipality = (props: StaticProps<typeof getStaticProps>) => {
  const {
    municipalityName,
    choropleth,
    selectedGmData: data,
    content,
    lastGenerated,
  } = props;

  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { siteText, ...formatters } = useIntl();

  const text = siteText.gemeente_actueel;
  const gmCode = router.query.code as string;

  const vrForMunicipality = getVrForMunicipalityCode(gmCode);

  assert(
    vrForMunicipality,
    `Unable to get safety region for gm code "${gmCode}"`
  );

  const dataHospitalIntake = data.hospital_nice;

  const filteredAgeGroup18Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (item) => item.age_group_range === '18+'
    );
  const renderedAgeGroup18Pluslabels = useAgegroupLabels(
    filteredAgeGroup18Plus,
    true
  );

  const internationalFeature = useFeature('inPositiveTestsPage');

  const dataSitemap = useDataSitemap('gm', gmCode, data);

  const metadata = {
    title: replaceVariablesInText(text.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      municipalityName,
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
          <TileList>
            <Box spacing={3}>
              <TopicalSectionHeader
                showBackLink
                lastGenerated={Number(props.lastGenerated)}
                title={replaceComponentsInText(text.title, {
                  municipalityName: municipalityName,
                })}
                headingLevel={1}
              />

              <MiniTileSelectorLayout
                link={{
                  text: replaceVariablesInText(
                    text.secties.actuele_situatie.link.text,
                    {
                      municipalityName: municipalityName,
                    }
                  ),
                  href: replaceVariablesInText(
                    text.secties.actuele_situatie.link.href,
                    { gmCode }
                  ),
                }}
                menuItems={[
                  {
                    label:
                      siteText.gemeente_actueel.mini_trend_tiles
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
                  } as MiniTileSelectorItem<GmHospitalNiceValue>,
                  {
                    label:
                      siteText.gemeente_actueel.mini_trend_tiles.vaccinatiegraad
                        .menu_item_label,
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
                  } as MiniTileSelectorItem<GmVaccineCoveragePerAgeGroupValue>,
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
                        href={reverseRouter.gm.ziekenhuisopnames(gmCode)}
                        icon={<ArrowIconRight />}
                        iconPlacement="right"
                        fontWeight="bold"
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
                      type: 'area',
                      metricProperty: 'admissions_on_date_of_reporting',
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
                        <Box fontSize={5}>
                          <Markdown
                            content={replaceVariablesInText(
                              text.mini_trend_tiles.vaccinatiegraad.text,
                              renderedAgeGroup18Pluslabels,
                              formatters
                            )}
                          />
                        </Box>
                        <LinkWithIcon
                          href={reverseRouter.gm.vaccinaties(gmCode)}
                          icon={<ArrowIconRight />}
                          iconPlacement="right"
                          fontWeight="bold"
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

            <Box pt={4} pb={5}>
              <Search title={siteText.common_actueel.secties.search.title.gm} />
            </Box>

            <VaccinationCoverageChoropleth
              title={replaceVariablesInText(
                siteText.common_actueel.secties.vaccination_coverage_choropleth
                  .title.gm,
                { municipalityName: municipalityName }
              )}
              content={replaceVariablesInText(
                siteText.common_actueel.secties.vaccination_coverage_choropleth
                  .content.gm,
                { municipalityName: municipalityName }
              )}
              gmCode={gmCode}
              data={{ gm: choropleth.gm.vaccine_coverage_per_age_group }}
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
                    href: reverseRouter.vr.index(vrForMunicipality.code),
                    text: replaceVariablesInText(
                      text.quick_links.links.veiligheidsregio,
                      { safetyRegionName: vrForMunicipality.name }
                    ),
                  },
                  {
                    href: reverseRouter.gm.index(gmCode),
                    text: replaceVariablesInText(
                      text.quick_links.links.gemeente,
                      { municipalityName: municipalityName }
                    ),
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
                  { municipalityName: municipalityName }
                )}
                dataSitemap={dataSitemap}
              />
            </CollapsibleButton>
          </TileList>
        </MaxWidth>

        <Spacer mb={5} />

        <Box width="100%" backgroundColor="offWhite" pb={5}>
          <MaxWidth
            spacing={3}
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

export default TopicalMunicipality;
