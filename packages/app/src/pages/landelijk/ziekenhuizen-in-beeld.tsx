import { colors, getLastFilledValue, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { IntensiveCareOpnames } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { ChartTileToggleItem } from '~/components/chart-tile-toggle';
import { InView } from '~/components/in-view';
import { BorderedKpiSection } from '~/components/kpi/bordered-kpi-section';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { SEOHead } from '~/components/seo-head';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Layout, NlLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { PagePart, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { trimLeadingNullValues } from '~/utils/trim-leading-null-values';

const pageMetrics = [
  'difference.hospital_lcps__beds_occupied_covid',
  'difference.hospital_lcps__influx_covid_patients',
  'difference.intensive_care_lcps__beds_occupied_covid',
  'difference.intensive_care_lcps__influx_covid_patients',
  'hospital_lcps',
  'intensive_care_lcps',
];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.hospitals_and_care_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('difference.hospital_lcps__beds_occupied_covid', 'difference.intensive_care_lcps__beds_occupied_covid', 'hospital_lcps', 'intensive_care_lcps'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<PagePart>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
          "parts": ${getPagePartsQuery('hospitals_and_care_page')},
          "elements": ${getElementsQuery('nl', ['hospital_lcps', 'intensive_care_lcps'], context.locale)}
        }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'hospitalAndCarePageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'hospitalAndCarePageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'hospitalAndCarePageDataExplained'),
        links: getLinkParts(content.parts.pageParts, 'hospitalAndCarePageLinks'),
        elements: content.elements,
      },
    };
  }
);

const HospitalsAndCarePage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, content, lastGenerated } = props;
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const { commonTexts } = useIntl();

  const [selectedBedsOccupiedOverTimeChart, setSelectedBedsOccupiedOverTimeChart] = useState<string>('beds_occupied_covid_hospital');
  const [hospitalBedsOccupiedOverTimeTimeframe, setHospitalBedsOccupiedOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.THIRTY_DAYS);
  const [intensiveCareBedsTimeframe, setIntensiveCareBedsTimeframe] = useState<TimeframeOption>(TimeframeOption.THIRTY_DAYS);

  const bedsOccupiedOverTimeToggleItems: ChartTileToggleItem[] = [
    {
      label: textNl.hospitals.chart_beds_occupied.toggle_label,
      value: 'beds_occupied_covid_hospital',
    },
    {
      label: textNl.icu.chart_beds_occupied.toggle_label,
      value: 'beds_occupied_covid_icu',
    },
  ];

  const [selectedPatientInfluxOverTimeChart, setSelectedPatientInfluxOverTimeChart] = useState<string>('patients_influx_hospital');
  const [hospitalPatientInfluxOverTimeTimeframe, setHospitalPatientInfluxOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.THIRTY_DAYS);
  const [intensiveCarePatientInfluxOverTimeTimeframe, setIntensiveCarePatientInfluxOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.THIRTY_DAYS);

  const patientInfluxOverTimeToggleItems: ChartTileToggleItem[] = [
    {
      label: textNl.hospitals.chart_patient_influx.toggle_label,
      value: 'patients_influx_hospital',
    },
    {
      label: textNl.icu.chart_patient_influx.toggle_label,
      value: 'patients_influx_icu',
    },
  ];

  const hospitalLastValue = getLastFilledValue(data.hospital_lcps);
  const icuLastValue = getLastFilledValue(data.intensive_care_lcps);

  const valuesWithoutDateRange = data.hospital_lcps.values.map((value) => ({ ...value, date_end_unix: undefined, date_start_unix: undefined }));

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadataTexts} lastGenerated={lastGenerated}>
      <NlLayout>
        <SEOHead title={textNl.metadata.title} description={textNl.metadata.description} />
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.consequences_for_healthcare.title}
            screenReaderCategory={commonTexts.sidebar.metrics.hospitals_and_care.title}
            title={textNl.title}
            icon={<IntensiveCareOpnames aria-hidden="true" />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: hospitalLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.sources.lnaz],
            }}
            pageLinks={content.links}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          <BorderedKpiSection
            title={textNl.kpi_tiles.occupancies.title}
            description={textNl.kpi_tiles.occupancies.description}
            source={textNl.sources.lnaz}
            dateOrRange={{ start: hospitalLastValue.date_start_unix, end: hospitalLastValue.date_end_unix }}
            tilesData={[
              {
                value: hospitalLastValue.beds_occupied_covid_moving_average,
                differenceValue: data.difference.hospital_lcps__beds_occupied_covid,
                title: textNl.kpi_tiles.occupancies.hospital.title,
                description: textNl.kpi_tiles.occupancies.hospital.description,
              },
              {
                value: icuLastValue.beds_occupied_covid_moving_average,
                differenceValue: data.difference.intensive_care_lcps__beds_occupied_covid,
                title: textNl.kpi_tiles.occupancies.icu.title,
                description: textNl.kpi_tiles.occupancies.icu.description,
              },
            ]}
          />

          {selectedBedsOccupiedOverTimeChart === 'beds_occupied_covid_hospital' && (
            <ChartTile
              timeframeOptions={TimeframeOptionsList}
              title={textNl.hospitals.chart_beds_occupied.title}
              description={textNl.hospitals.chart_beds_occupied.description}
              metadata={{ source: textNl.sources.lnaz }}
              timeframeInitialValue={hospitalBedsOccupiedOverTimeTimeframe}
              onSelectTimeframe={setHospitalBedsOccupiedOverTimeTimeframe}
              toggle={{
                initialValue: selectedBedsOccupiedOverTimeChart,
                items: bedsOccupiedOverTimeToggleItems,
                onChange: (value) => setSelectedBedsOccupiedOverTimeChart(value),
              }}
            >
              <TimeSeriesChart
                accessibility={{
                  key: 'hospital_beds_occupied_over_time_chart',
                }}
                values={valuesWithoutDateRange}
                timeframe={hospitalBedsOccupiedOverTimeTimeframe}
                forceLegend
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'beds_occupied_covid',
                    nonInteractive: true,
                    hideInLegend: true,
                    label: textNl.hospitals.chart_beds_occupied.legend_trend_label,
                    color: colors.primary,
                  },
                  {
                    type: 'scatter-plot',
                    metricProperty: 'beds_occupied_covid',
                    label: textNl.hospitals.chart_beds_occupied.legend_dot_label,
                    color: colors.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: data.hospital_lcps.values[0].date_unix,
                      end: new Date('1 June 2020').getTime() / 1000,
                      label: textNl.hospitals.chart_beds_occupied.legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
                    },
                  ],
                  timelineEvents: getTimelineEvents(content.elements.timeSeries, 'hospital_lcps', 'beds_occupied_covid'),
                }}
              />
            </ChartTile>
          )}

          {selectedBedsOccupiedOverTimeChart === 'beds_occupied_covid_icu' && (
            <ChartTile
              title={textNl.icu.chart_beds_occupied.title}
              description={textNl.icu.chart_beds_occupied.description}
              metadata={{ source: textNl.sources.lnaz }}
              timeframeOptions={TimeframeOptionsList}
              timeframeInitialValue={intensiveCareBedsTimeframe}
              onSelectTimeframe={setIntensiveCareBedsTimeframe}
              toggle={{
                initialValue: selectedBedsOccupiedOverTimeChart,
                items: bedsOccupiedOverTimeToggleItems,
                onChange: (value) => setSelectedBedsOccupiedOverTimeChart(value),
              }}
            >
              <TimeSeriesChart
                accessibility={{
                  key: 'intensive_care_beds_occupied_over_time_chart',
                }}
                values={data.intensive_care_lcps.values}
                timeframe={intensiveCareBedsTimeframe}
                forceLegend
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'beds_occupied_covid',
                    nonInteractive: true,
                    hideInLegend: true,
                    label: textNl.icu.chart_beds_occupied.legend_trend_label,
                    color: colors.primary,
                  },
                  {
                    type: 'scatter-plot',
                    metricProperty: 'beds_occupied_covid',
                    label: textNl.icu.chart_beds_occupied.legend_dot_label,
                    color: colors.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: data.intensive_care_lcps.values[0].date_unix,
                      end: new Date('1 June 2020').getTime() / 1000,
                      label: textNl.icu.chart_beds_occupied.legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
                    },
                  ],
                  timelineEvents: getTimelineEvents(content.elements.timeSeries, 'intensive_care_lcps', 'beds_occupied_covid'),
                }}
              />
            </ChartTile>
          )}

          <BorderedKpiSection
            title={textNl.kpi_tiles.influxes.title}
            description={textNl.kpi_tiles.influxes.description}
            source={textNl.sources.lnaz}
            dateOrRange={{ start: hospitalLastValue.date_start_unix, end: hospitalLastValue.date_end_unix }}
            tilesData={[
              {
                value: hospitalLastValue.influx_covid_patients,
                title: textNl.kpi_tiles.influxes.hospital.title,
                description: textNl.kpi_tiles.influxes.hospital.description,
              },
              {
                value: icuLastValue.influx_covid_patients,
                title: textNl.kpi_tiles.influxes.icu.title,
                description: textNl.kpi_tiles.influxes.icu.description,
              },
            ]}
          />

          {selectedPatientInfluxOverTimeChart === 'patients_influx_hospital' && (
            <ChartTile
              timeframeOptions={TimeframeOptionsList}
              title={textNl.hospitals.chart_patient_influx.title}
              description={textNl.hospitals.chart_patient_influx.description}
              metadata={{ source: textNl.sources.lnaz }}
              timeframeInitialValue={hospitalPatientInfluxOverTimeTimeframe}
              onSelectTimeframe={setHospitalPatientInfluxOverTimeTimeframe}
              toggle={{
                initialValue: selectedPatientInfluxOverTimeChart,
                items: patientInfluxOverTimeToggleItems,
                onChange: (value) => setSelectedPatientInfluxOverTimeChart(value),
              }}
            >
              <TimeSeriesChart
                accessibility={{
                  key: 'hospital_patient_influx_over_time_chart',
                }}
                values={trimLeadingNullValues(valuesWithoutDateRange, 'influx_covid_patients')}
                timeframe={hospitalPatientInfluxOverTimeTimeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'influx_covid_patients_moving_average',
                    label: textNl.hospitals.chart_patient_influx.legend_title_moving_average,
                    color: colors.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'influx_covid_patients',
                    label: textNl.hospitals.chart_patient_influx.legend_title_trend_label,
                    color: colors.primary,
                  },
                ]}
                dataOptions={{
                  timelineEvents: getTimelineEvents(content.elements.timeSeries, 'hospital_lcps'),
                }}
              />
            </ChartTile>
          )}

          {selectedPatientInfluxOverTimeChart === 'patients_influx_icu' && (
            <ChartTile
              timeframeOptions={TimeframeOptionsList}
              title={textNl.icu.chart_patient_influx.title}
              description={textNl.icu.chart_patient_influx.description}
              metadata={{ source: textNl.sources.lnaz }}
              timeframeInitialValue={intensiveCarePatientInfluxOverTimeTimeframe}
              onSelectTimeframe={setIntensiveCarePatientInfluxOverTimeTimeframe}
              toggle={{
                initialValue: selectedPatientInfluxOverTimeChart,
                items: patientInfluxOverTimeToggleItems,
                onChange: (value) => setSelectedPatientInfluxOverTimeChart(value),
              }}
            >
              <TimeSeriesChart
                accessibility={{
                  key: 'intensive_care_patient_influx_over_time_chart',
                }}
                values={trimLeadingNullValues(data.intensive_care_lcps.values, 'influx_covid_patients')}
                timeframe={intensiveCarePatientInfluxOverTimeTimeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'influx_covid_patients_moving_average',
                    label: textNl.icu.chart_patient_influx.legend_title_moving_average,
                    color: colors.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'influx_covid_patients',
                    label: textNl.icu.chart_patient_influx.legend_title_trend_label,
                    color: colors.primary,
                  },
                ]}
                dataOptions={{
                  timelineEvents: getTimelineEvents(content.elements.timeSeries, 'intensive_care_lcps'),
                }}
              />
            </ChartTile>
          )}

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default HospitalsAndCarePage;
