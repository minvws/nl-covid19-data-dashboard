import { colors, DAY_IN_SECONDS, getLastFilledValue, TimeframeOption, TimeframeOptionsList, WEEK_IN_SECONDS } from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { TwoKpiSection, TimeSeriesChart, TileList, SEOHead, ChartTile, KpiTile, KpiValue, PageInformationBlock, PageKpi } from '~/components';
import { Layout, NlLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery } from '~/queries/get-elements-query';
import { getArticleParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { countTrailingNullValues, getBoundaryDateStartUnix, replaceVariablesInText } from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { ChartTileToggleItem } from '~/components/chart-tile-toggle';

const pageMetrics = ['difference.hospital_lcps__beds_occupied_covid.new_date_unix', 'hospital_lcps', 'intensive_care_lcps'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.hospitals_and_care_page.nl,
  textShared: siteText.pages.hospitals_and_care_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('difference.hospital_lcps__beds_occupied_covid', 'hospital_lcps', 'intensive_care_lcps'),
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
          "parts": ${getPagePartsQuery('hospitals_and_care_page')},
          "elements": ${getElementsQuery('nl', ['hospital_lcps', 'intensive_care_lcps'], context.locale)}
        }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'hospitalAndCarePageArticles'),
        links: getLinkParts(content.parts.pageParts, 'hospitalAndCarePageLinks'),
        elements: content.elements,
      },
    };
  }
);

const HospitalsAndCarePage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, content, lastGenerated } = props;
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const { commonTexts, formatDateFromSeconds } = useIntl();

  const dataHospitalLcps = data.hospital_lcps;
  /**
   * Can be replaced with corrent property once data / schema changes are available
   * Temporary workaround by adding `beds_occupied_covid` to the following line instead of `influx_on_date`
   * */
  const underReportedRange = getBoundaryDateStartUnix(data.hospital_lcps.values, countTrailingNullValues(data.hospital_lcps.values, 'beds_occupied_covid'));
  const sevenDayAverageDates: [number, number] = [underReportedRange - WEEK_IN_SECONDS, underReportedRange - DAY_IN_SECONDS];

  const [selectedBedsOccupiedOverTimeChart, setSelectedBedsOccupiedOverTimeChart] = useState<string>('beds_occupied_covid_hospital'); // other option is 'beds_occupied_covid_icu'
  const [hospitalBedsOccupiedOverTimeTimeframe, setHospitalBedsOccupiedOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [intensiveCareBedsTimeframe, setIntensiveCareBedsTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

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

  const bedsLastValue = getLastFilledValue(dataHospitalLcps);
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
            icon={<Ziekenhuis aria-hidden="true" />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: dataHospitalLcps.last_value.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.sources.nice, textNl.sources.lnaz],
            }}
            referenceLink={textNl.reference.href}
            pageLinks={content.links}
            articles={content.articles}
          />
          <TwoKpiSection>
            <KpiTile
              title={textNl.barscale_titel}
              description={replaceVariablesInText(textNl.extra_uitleg, {
                dateStart: formatDateFromSeconds(sevenDayAverageDates[0]),
                dateEnd: formatDateFromSeconds(sevenDayAverageDates[1]),
              })}
              metadata={{
                date: sevenDayAverageDates,
                source: textNl.sources.nice,
              }}
            >
              <PageKpi data={data} metricName="hospital_lcps" metricProperty="beds_occupied_covid" isMovingAverageDifference isAmount />
            </KpiTile>

            <KpiTile
              title={textNl.kpi_bedbezetting.title}
              description={textNl.kpi_bedbezetting.description}
              metadata={{
                date: dataHospitalLcps.last_value.date_unix,
                source: textNl.sources.lnaz,
              }}
            >
              {bedsLastValue.beds_occupied_covid !== null && (
                <KpiValue data-cy="beds_occupied_covid" absolute={bedsLastValue.beds_occupied_covid} difference={data.difference.hospital_lcps__beds_occupied_covid} isAmount />
              )}
            </KpiTile>
          </TwoKpiSection>
          {selectedBedsOccupiedOverTimeChart === 'beds_occupied_covid_hospital' && (
            <ChartTile
              timeframeOptions={TimeframeOptionsList}
              title={textNl.hospitals.chart_beds_occupied.title}
              description={textNl.hospitals.chart_beds_occupied.description}
              metadata={{ source: textNl.sources.lnaz }}
              timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
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
                values={dataHospitalLcps.values}
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
                      start: dataHospitalLcps.values[0].date_unix,
                      end: new Date('1 June 2020').getTime() / 1000,
                      label: textNl.hospitals.chart_beds_occupied.legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
                    },
                  ],
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
              timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
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
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: data.intensive_care_lcps.values[0].date_unix,
                      end: new Date('1 June 2020').getTime() / 1000,
                      label: textNl.icu.chart_beds_occupied.legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
                    },
                  ],
                }}
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
              />
            </ChartTile>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default HospitalsAndCarePage;
