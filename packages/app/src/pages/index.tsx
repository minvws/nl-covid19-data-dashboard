import {
  NlHospitalNiceValue,
  NlIntensiveCareNiceValue,
  NlVaccineCoveragePerAgeGroupEstimated,
} from '@corona-dashboard/common';
import { Arts, Chart, Vaccinaties, Ziekenhuis } from '@corona-dashboard/icons';
import { last } from 'lodash';
import { isDefined } from 'ts-is-present';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { CollapsibleButton } from '~/components/collapsible';
import { ContentTeaserProps } from '~/components/content-teaser';
import { DataDrivenText } from '~/components/data-driven-text';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { Sitemap, useDataSitemap } from '~/components/sitemap';
import { TileList } from '~/components/tile-list';
import { VaccinationCoverageChoropleth } from '~/domain/actueel/vaccination-coverage-choropleth';
import { EscalationLevelBanner } from '~/domain/escalation-level/escalation-level-banner';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { Search } from '~/domain/topical/components/search';
import {
  HighlightsTile,
  WeeklyHighlightProps,
} from '~/domain/topical/highlights-tile';
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
    articles: ContentTeaserProps[];
    weeklyHighlight?: WeeklyHighlightProps;
    highlights: ContentTeaserProps[];
    elements: ElementsQueryResult;
  }>(
    getTopicalPageQuery('nl', [
      'intensive_care_nice',
      'hospital_nice',
      'vaccine_coverage_per_age_group_estimated',
    ])
  ),
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
  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg="white" pb={4}>
        <MaxWidth id="content">
          <TileList>
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
                  ...text.secties.actuele_situatie.link,
                  href: reverseRouter.nl.index(),
                }}
                menuItems={[
                  {
                    label:
                      siteText.nationaal_actueel.mini_trend_tiles.ic_opnames
                        .menu_item_label,
                    data: dataICTotal.values,
                    dataProperty:
                      'admissions_on_date_of_admission_moving_average',
                    value:
                      last(dataICTotal.values)
                        ?.admissions_on_date_of_admission_moving_average ?? 0,
                    warning: getWarning(
                      content.elements.warning,
                      'intensive_care_nice'
                    ),
                  } as MiniTileSelectorItem<NlIntensiveCareNiceValue>,
                  {
                    label:
                      siteText.nationaal_actueel.mini_trend_tiles
                        .ziekenhuis_opnames.menu_item_label,
                    data: dataHospitalIntake.values,
                    dataProperty:
                      'admissions_on_date_of_admission_moving_average',
                    value:
                      last(dataHospitalIntake.values)
                        ?.admissions_on_date_of_admission_moving_average ?? 0,
                    warning: getWarning(
                      content.elements.warning,
                      'hospital_nice'
                    ),
                  } as MiniTileSelectorItem<NlHospitalNiceValue>,
                  {
                    label:
                      siteText.nationaal_actueel.mini_trend_tiles
                        .vaccinatiegraad.menu_item_label,
                    data: data.vaccine_coverage_per_age_group_estimated.values,
                    dataProperty: 'age_18_plus_fully_vaccinated',
                    value:
                      last(data.vaccine_coverage_per_age_group_estimated.values)
                        ?.age_18_plus_fully_vaccinated ?? 0,
                    valueIsPercentage: true,
                    warning: getWarning(
                      content.elements.warning,
                      'vaccine_coverage_per_age_group_estimated'
                    ),
                    hideSparkBar:
                      data.vaccine_coverage_per_age_group_estimated.values
                        .length < 7,
                  } as MiniTileSelectorItem<NlVaccineCoveragePerAgeGroupEstimated>,
                ]}
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
                              'admissions_on_date_of_admission_moving_average',
                            differenceKey:
                              'intensive_care_nice__admissions_on_date_of_reporting_moving_average',
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
                        icon={<ArrowIconRight />}
                        iconPlacement="right"
                        fontWeight="bold"
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
                      type: 'area',
                      metricProperty: 'admissions_on_date_of_admission',
                      label:
                        siteText.ic_opnames_per_dag
                          .linechart_legend_trend_label,
                      color: colors.data.primary,
                      curve: 'step',
                      strokeWidth: 0,
                      noHover: true,
                    },
                  ]}
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
                              'admissions_on_date_of_admission_moving_average',
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
                      <LinkWithIcon
                        href={reverseRouter.nl.ziekenhuisopnames()}
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
                      noHover: true,
                    },
                  ]}
                  accessibility={{ key: 'topical_hospital_nice' }}
                  warning={getWarning(
                    content.elements.warning,
                    'hospital_nice'
                  )}
                />

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
                            vaccineCoverageEstimatedLastValue as unknown as Record<
                              string,
                              number
                            >,
                            formatters
                          )}
                        />
                      </Box>
                      <LinkWithIcon
                        href={reverseRouter.nl.vaccinaties()}
                        icon={<ArrowIconRight />}
                        iconPlacement="right"
                        fontWeight="bold"
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
                  warning={getWarning(
                    content.elements.warning,
                    'vaccine_coverage_per_age_group_estimated'
                  )}
                />
              </MiniTileSelectorLayout>
            </Box>

            <EscalationLevelBanner level={2} date={1632554802} />

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

            <Box py={4}>
              <Search title={siteText.common_actueel.secties.search.title.nl} />
            </Box>

            <HighlightsTile
              hiddenTitle={text.highlighted_items.title}
              weeklyHighlight={content.weeklyHighlight}
              highlights={content.highlights}
              showWeeklyHighlight={content.showWeeklyHighlight}
            />

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
          </TileList>
        </MaxWidth>

        <Box width="100%" backgroundColor="page" pb={5}>
          <MaxWidth>
            <TileList>
              <TopicalSectionHeader
                title={siteText.common_actueel.secties.meer_lezen.titel}
                description={
                  siteText.common_actueel.secties.meer_lezen.omschrijving
                }
                link={siteText.common_actueel.secties.meer_lezen.link}
                headerVariant="h2"
              />

              <ArticleList articles={content.articles} />
            </TileList>
          </MaxWidth>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
