import { colors, GmCollectionHospitalNice, TimeframeOption, TimeframeOptionsList, VrCollectionHospitalNice } from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { TileList, SEOHead, ChartTile, DynamicChoropleth, ChoroplethTile, PageInformationBlock, TimeSeriesChart } from '~/components';
import { RegionControlOption } from '~/components/chart-region-controls';
import { thresholds } from '~/components/choropleth/logic/thresholds';
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
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { last } from 'lodash';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['hospital_nice_per_age_group', 'hospital_nice'];

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

  const [hospitalAdmissionsPerAgeTimeframe, setHospitalAdmissionsPerAgeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [IcuAdmissionsPerAgeTimeframe, setIcuAdmissionsPerAgeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [hospitalAdmissionsOverTimeTimeframe, setHospitalAdmissionsOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [intensiveCareAdmissionsTimeframe, setIntensiveCareAdmissionsTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

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

  const { commonTexts } = useIntl();
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

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
              dataSources: [textNl.bronnen.nice, textNl.bronnen.lnaz],
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
              source: textNl.bronnen.nice,
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

          <ChartTile
            title={textNl.icu.age_group_chart.title}
            description={textNl.icu.age_group_chart.description}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
            metadata={{ source: textNl.bronnen.nice }}
            onSelectTimeframe={setIcuAdmissionsPerAgeTimeframe}
          >
            <AdmissionsPerAgeGroup
              accessibility={{
                key: 'intensive_care_admissions_per_age_group_over_time_chart',
              }}
              values={data.intensive_care_nice_per_age_group.values}
              timeframe={IcuAdmissionsPerAgeTimeframe}
              timelineEvents={getTimelineEvents(content.elements.timeSeries, 'intensive_care_nice_per_age_group')}
            />
          </ChartTile>

          <ChartTile
            title={textNl.hospital.age_group_chart.title}
            description={textNl.hospital.age_group_chart.description}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
            metadata={{ source: textNl.bronnen.nice }}
            onSelectTimeframe={setHospitalAdmissionsPerAgeTimeframe}
          >
            <AdmissionsPerAgeGroup
              accessibility={{
                key: 'hospital_admissions_per_age_group_over_time_chart',
              }}
              values={data.hospital_nice_per_age_group.values}
              timeframe={hospitalAdmissionsPerAgeTimeframe}
              timelineEvents={getTimelineEvents(content.elements.timeSeries, 'hospital_nice_per_age_group')}
            />
          </ChartTile>
          <ChartTile
            title={textNl.hospital.line_chart.title}
            description={textNl.hospital.line_chart.description}
            metadata={{
              source: textNl.bronnen.nice,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
            onSelectTimeframe={setHospitalAdmissionsOverTimeTimeframe}
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
                  label: textNl.hospital.line_chart.legend_title_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'admissions_on_date_of_admission',
                  label: textNl.hospital.line_chart.legend_title,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedRange,
                    end: Infinity,
                    label: textNl.hospital.line_chart.legend_underreported_title,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['admissions_on_date_of_admission_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'hospital_nice'),
              }}
            />
          </ChartTile>
          <ChartTile
            title={textNl.icu.line_chart.title}
            description={textNl.icu.line_chart.description}
            metadata={{ source: textNl.bronnen.nice }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
            onSelectTimeframe={setIntensiveCareAdmissionsTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'intensive_care_admissions_over_time_chart',
              }}
              values={data.intensive_care_nice.values}
              timeframe={intensiveCareAdmissionsTimeframe}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: intakeUnderReportedRange,
                    end: Infinity,
                    label: textNl.icu.line_chart.legend_underreported_title,
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
                  label: textNl.icu.line_chart.legend_title_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'admissions_on_date_of_admission',
                  label: textNl.icu.line_chart.legend_title_trend_label,
                  color: colors.primary,
                },
              ]}
            />
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default PatientsPage;
