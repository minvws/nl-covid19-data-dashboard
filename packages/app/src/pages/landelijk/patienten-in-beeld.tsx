import { colors, GmCollectionHospitalNice, TimeframeOption, TimeframeOptionsList, VrCollectionHospitalNice } from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { last } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { RegionControlOption } from '~/components/chart-region-controls';
import { ChartTile } from '~/components/chart-tile';
import { ChartTileToggleItem } from '~/components/chart-tile-toggle';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { InView } from '~/components/in-view';
import { PageInformationBlock } from '~/components/page-information-block';
import { SEOHead } from '~/components/seo-head';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { AdmissionsPerAgeGroup } from '~/domain/hospital';
import { Layout, NlLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { countTrailingNullValues, getBoundaryDateStartUnix, useReverseRouter } from '~/utils';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = ['hospital_nice_per_age_group', 'intensive_care_nice_per_age_group', 'hospital_nice', 'intensive_care_nice'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.patients_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('hospital_nice_per_age_group', 'intensive_care_nice_per_age_group', 'hospital_nice', 'intensive_care_nice'),
  createGetChoroplethData({
    vr: ({ hospital_nice_choropleth }) => ({ hospital_nice_choropleth }),
    gm: ({ hospital_nice_choropleth }) => ({ hospital_nice_choropleth }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
            "parts": ${getPagePartsQuery('patients_page')},
            "elements": ${getElementsQuery('nl', ['hospital_nice', 'intensive_care_nice_per_age_group', 'hospital_nice_per_age_group', 'intensive_care_nice'], context.locale)}
          }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'patientsPageArticles'),
        links: getLinkParts(content.parts.pageParts, 'patientsPageLinks'),
        elements: content.elements,
      },
    };
  }
);

const PatientsPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, choropleth, content, lastGenerated } = props;
  const { commonTexts } = useIntl();
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const [selectedAdmissionsPerAgeGroupOverTimeChart, setSelectedAdmissionsPerAgeGroupOverTimeChart] = useState<string>('admissions_per_age_group_over_time_hospital');
  const [hospitalAdmissionsPerAgeGroupOverTimeTimeframe, setHospitalAdmissionsPerAgeGroupOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [intensiveCareAdmissionsPerAgeGroupOverTimeTimeframe, setIntensiveCareAdmissionsPerAgeGroupOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const admissionsPerAgeGroupOverTimeToggleItems: ChartTileToggleItem[] = [
    {
      label: textNl.hospitals.admissions_per_age_group_chart.toggle_label,
      value: 'admissions_per_age_group_over_time_hospital',
    },
    {
      label: textNl.icu.admissions_per_age_group_chart.toggle_label,
      value: 'admissions_per_age_group_over_time_icu',
    },
  ];

  const [selectedAdmissionsOverTimeChart, setSelectedAdmissionsOverTimeChart] = useState<string>('admissions_over_time_hospital');
  const [hospitalAdmissionsOverTimeTimeframe, setHospitalAdmissionsOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [intensiveCareAdmissionsOverTimeTimeframe, setIntensiveCareAdmissionsOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const admissionsOverTimeToggleItems: ChartTileToggleItem[] = [
    {
      label: textNl.hospitals.admissions_chart.toggle_label,
      value: 'admissions_over_time_hospital',
    },
    {
      label: textNl.icu.admissions_chart.toggle_label,
      value: 'admissions_over_time_icu',
    },
  ];

  const reverseRouter = useReverseRouter();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('vr');

  const lastValueNice = data.hospital_nice.last_value;
  const lastValueNiceChoropleth = (selectedMap === 'gm' ? last(choropleth.gm.hospital_nice_choropleth) : last(choropleth.vr.hospital_nice_choropleth)) || lastValueNice;
  const underReportedRange = getBoundaryDateStartUnix(
    data.hospital_nice.values,
    countTrailingNullValues(data.hospital_nice.values, 'admissions_on_date_of_admission_moving_average')
  );

  const intakeUnderReportedRange = getBoundaryDateStartUnix(
    data.intensive_care_nice.values,
    countTrailingNullValues(data.intensive_care_nice.values, 'admissions_on_date_of_admission_moving_average')
  );

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const choroplethDataGm: GmCollectionHospitalNice[] = choropleth.gm.hospital_nice_choropleth;
  const choroplethDataVr: VrCollectionHospitalNice[] = choropleth.vr.hospital_nice_choropleth;

  return (
    <Layout {...metadataTexts} lastGenerated={lastGenerated}>
      <NlLayout>
        <SEOHead title={textNl.metadata.title} description={textNl.metadata.description} />
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.consequences_for_healthcare.title}
            screenReaderCategory={commonTexts.sidebar.metrics.hospitals_and_care.title}
            title={textNl.title}
            icon={<Ziekenhuis aria-hidden="true" />}
            description={textNl.description}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: lastValueNice.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.sources.nice, textNl.sources.lnaz],
            }}
            referenceLink={textNl.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />

          <ChoroplethTile
            title={textNl.choropleth.title}
            description={textNl.choropleth.description}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            legend={{
              thresholds: selectedMap === 'gm' ? thresholds.gm.admissions_on_date_of_admission_per_100000 : thresholds.gm.admissions_on_date_of_admission_per_100000,
              title: textNl.choropleth.legend_title,
            }}
            metadata={{
              date: lastValueNiceChoropleth.date_unix,
              source: textNl.sources.nice,
            }}
          >
            {selectedMap === 'gm' && (
              <DynamicChoropleth
                accessibility={{
                  key: 'hospital_admissions_municipal_choropleth',
                }}
                map="gm"
                data={choroplethDataGm}
                dataConfig={{
                  metricName: 'hospital_nice_choropleth',
                  metricProperty: 'admissions_on_date_of_admission_per_100000',
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.ziekenhuisopnames,
                  tooltipVariables: {
                    patients: commonTexts.choropleth_tooltip.patients,
                  },
                }}
              />
            )}
            {selectedMap === 'vr' && (
              <DynamicChoropleth
                accessibility={{
                  key: 'hospital_admissions_region_choropleth',
                }}
                map="vr"
                thresholdMap="gm"
                data={choroplethDataVr}
                dataConfig={{
                  metricName: 'hospital_nice_choropleth',
                  metricProperty: 'admissions_on_date_of_admission_per_100000',
                }}
                dataOptions={{
                  getLink: reverseRouter.vr.ziekenhuisopnames,
                  tooltipVariables: {
                    patients: commonTexts.choropleth_tooltip.patients,
                  },
                }}
              />
            )}
          </ChoroplethTile>

          <InView rootMargin="400px">
            {selectedAdmissionsPerAgeGroupOverTimeChart === 'admissions_per_age_group_over_time_hospital' && (
              <ChartTile
                title={textNl.hospitals.admissions_per_age_group_chart.title}
                description={textNl.hospitals.admissions_per_age_group_chart.description}
                timeframeOptions={TimeframeOptionsList}
                timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
                metadata={{ source: textNl.sources.nice }}
                onSelectTimeframe={setHospitalAdmissionsPerAgeGroupOverTimeTimeframe}
                toggle={{
                  initialValue: selectedAdmissionsPerAgeGroupOverTimeChart,
                  items: admissionsPerAgeGroupOverTimeToggleItems,
                  onChange: (value) => setSelectedAdmissionsPerAgeGroupOverTimeChart(value),
                }}
              >
                <AdmissionsPerAgeGroup
                  accessibility={{
                    key: 'hospital_admissions_per_age_group_over_time_chart',
                  }}
                  values={data.hospital_nice_per_age_group.values}
                  timeframe={hospitalAdmissionsPerAgeGroupOverTimeTimeframe}
                  timelineEvents={getTimelineEvents(content.elements.timeSeries, 'hospital_nice_per_age_group')}
                />
              </ChartTile>
            )}

            {selectedAdmissionsPerAgeGroupOverTimeChart === 'admissions_per_age_group_over_time_icu' && (
              <ChartTile
                title={textNl.icu.admissions_per_age_group_chart.title}
                description={textNl.icu.admissions_per_age_group_chart.description}
                timeframeOptions={TimeframeOptionsList}
                timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
                metadata={{ source: textNl.sources.nice }}
                onSelectTimeframe={setIntensiveCareAdmissionsPerAgeGroupOverTimeTimeframe}
                toggle={{
                  initialValue: selectedAdmissionsPerAgeGroupOverTimeChart,
                  items: admissionsPerAgeGroupOverTimeToggleItems,
                  onChange: (value) => setSelectedAdmissionsPerAgeGroupOverTimeChart(value),
                }}
              >
                <AdmissionsPerAgeGroup
                  accessibility={{
                    key: 'intensive_care_admissions_per_age_group_over_time_chart',
                  }}
                  values={data.intensive_care_nice_per_age_group.values}
                  timeframe={intensiveCareAdmissionsPerAgeGroupOverTimeTimeframe}
                  timelineEvents={getTimelineEvents(content.elements.timeSeries, 'intensive_care_nice_per_age_group')}
                />
              </ChartTile>
            )}
          </InView>

          <InView rootMargin="400px">
            {selectedAdmissionsOverTimeChart === 'admissions_over_time_hospital' && (
              <ChartTile
                title={textNl.hospitals.admissions_chart.title}
                description={textNl.hospitals.admissions_chart.description}
                metadata={{
                  source: textNl.sources.nice,
                }}
                timeframeOptions={TimeframeOptionsList}
                timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
                onSelectTimeframe={setHospitalAdmissionsOverTimeTimeframe}
                toggle={{
                  initialValue: selectedAdmissionsOverTimeChart,
                  items: admissionsOverTimeToggleItems,
                  onChange: (value) => setSelectedAdmissionsOverTimeChart(value),
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'hospital_admissions_over_time_chart',
                  }}
                  values={data.hospital_nice.values}
                  timeframe={hospitalAdmissionsOverTimeTimeframe}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'admissions_on_date_of_admission_moving_average',
                      label: textNl.hospitals.admissions_chart.legend_title_moving_average,
                      color: colors.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_admission',
                      label: textNl.hospitals.admissions_chart.legend_title,
                      color: colors.primary,
                    },
                  ]}
                  dataOptions={{
                    timespanAnnotations: [
                      {
                        start: underReportedRange,
                        end: Infinity,
                        label: textNl.hospitals.admissions_chart.legend_underreported_title,
                        shortLabel: commonTexts.common.incomplete,
                        cutValuesForMetricProperties: ['admissions_on_date_of_admission_moving_average'],
                      },
                    ],
                    timelineEvents: getTimelineEvents(content.elements.timeSeries, 'hospital_nice'),
                  }}
                />
              </ChartTile>
            )}

            {selectedAdmissionsOverTimeChart === 'admissions_over_time_icu' && (
              <ChartTile
                title={textNl.icu.admissions_chart.title}
                description={textNl.icu.admissions_chart.description}
                metadata={{ source: textNl.sources.nice }}
                timeframeOptions={TimeframeOptionsList}
                timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
                onSelectTimeframe={setIntensiveCareAdmissionsOverTimeTimeframe}
                toggle={{
                  initialValue: selectedAdmissionsOverTimeChart,
                  items: admissionsOverTimeToggleItems,
                  onChange: (value) => setSelectedAdmissionsOverTimeChart(value),
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'intensive_care_admissions_over_time_chart',
                  }}
                  values={data.intensive_care_nice.values}
                  timeframe={intensiveCareAdmissionsOverTimeTimeframe}
                  dataOptions={{
                    timespanAnnotations: [
                      {
                        start: intakeUnderReportedRange,
                        end: Infinity,
                        label: textNl.icu.admissions_chart.legend_underreported_title,
                        shortLabel: commonTexts.common.incomplete,
                        cutValuesForMetricProperties: ['admissions_on_date_of_admission_moving_average'],
                      },
                    ],
                    timelineEvents: getTimelineEvents(content.elements.timeSeries, 'intensive_care_nice'),
                  }}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'admissions_on_date_of_admission_moving_average',
                      label: textNl.icu.admissions_chart.legend_title_moving_average,
                      color: colors.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'admissions_on_date_of_admission',
                      label: textNl.icu.admissions_chart.legend_title_trend_label,
                      color: colors.primary,
                    },
                  ]}
                />
              </ChartTile>
            )}
          </InView>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default PatientsPage;
