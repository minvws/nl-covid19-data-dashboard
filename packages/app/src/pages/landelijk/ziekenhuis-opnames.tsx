import {
  colors,
  DAY_IN_SECONDS,
  getLastFilledValue,
  GmCollectionHospitalNice,
  TimeframeOption,
  TimeframeOptionsList,
  VrCollectionHospitalNice,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { TwoKpiSection, TimeSeriesChart, TileList, SEOHead, ChartTile, DynamicChoropleth, ChoroplethTile, KpiTile, KpiValue, PageInformationBlock, PageKpi } from '~/components';
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
import { countTrailingNullValues, getBoundaryDateStartUnix, replaceVariablesInText, useReverseRouter } from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { last } from 'lodash';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['difference.hospital_lcps__beds_occupied_covid.new_date_unix', 'hospital_lcps', 'hospital_nice_per_age_group', 'hospital_nice'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.hospital_page.nl,
  textShared: siteText.pages.hospital_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('difference.hospital_lcps__beds_occupied_covid', 'hospital_lcps', 'hospital_nice_per_age_group', 'hospital_nice'),
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
        "parts": ${getPagePartsQuery('hospital_page')},
        "elements": ${getElementsQuery('nl', ['hospital_nice', 'hospital_nice_per_age_group'], context.locale)}
      }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'hospitalPageArticles'),
        links: getLinkParts(content.parts.pageParts, 'hospitalPageLinks'),
        elements: content.elements,
      },
    };
  }
);

function IntakeHospital(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedNlData: data, choropleth, content, lastGenerated } = props;

  const [hospitalAdmissionsOverTimeTimeframe, setHospitalAdmissionsOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [hospitalBedsOccupiedOverTimeTimeframe, setHospitalBedsOccupiedOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [hospitalAdmissionsPerAgeTimeframe, setHospitalAdmissionsPerAgeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const reverseRouter = useReverseRouter();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('vr');

  const dataHospitalNice = data.hospital_nice;
  const dataHospitalLcps = data.hospital_lcps;
  const lastValueLcps = data.hospital_lcps.last_value;

  const lastValueNice = data.hospital_nice.last_value;
  const lastValueNiceChoropleth = (selectedMap === 'gm' ? last(choropleth.gm.hospital_nice_choropleth) : last(choropleth.vr.hospital_nice_choropleth)) || lastValueNice;

  const underReportedRange = getBoundaryDateStartUnix(dataHospitalNice.values, countTrailingNullValues(dataHospitalNice.values, 'admissions_on_date_of_admission_moving_average'));

  const sevenDayAverageDates: [number, number] = [underReportedRange - WEEK_IN_SECONDS, underReportedRange - DAY_IN_SECONDS];

  const bedsLastValue = getLastFilledValue(data.hospital_lcps);

  const { commonTexts, formatDateFromSeconds } = useIntl();
  const { metadataTexts, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

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
            screenReaderCategory={commonTexts.sidebar.metrics.hospital_admissions.title}
            title={textNl.titel}
            icon={<Ziekenhuis aria-hidden="true" />}
            description={textNl.pagina_toelichting}
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
          <TwoKpiSection>
            <KpiTile
              title={textNl.barscale_titel}
              description={replaceVariablesInText(textNl.extra_description, {
                dateStart: formatDateFromSeconds(sevenDayAverageDates[0]),
                dateEnd: formatDateFromSeconds(sevenDayAverageDates[1]),
              })}
              metadata={{
                date: sevenDayAverageDates,
                source: textNl.bronnen.nice,
              }}
            >
              <PageKpi data={data} metricName="hospital_nice" metricProperty="admissions_on_date_of_admission_moving_average_rounded" isMovingAverageDifference isAmount />
            </KpiTile>

            <KpiTile
              title={textNl.kpi_bedbezetting.title}
              description={textNl.kpi_bedbezetting.description}
              metadata={{
                date: lastValueLcps.date_unix,
                source: textNl.bronnen.lnaz,
              }}
            >
              {bedsLastValue.beds_occupied_covid !== null && (
                <KpiValue data-cy="beds_occupied_covid" absolute={bedsLastValue.beds_occupied_covid} difference={data.difference.hospital_lcps__beds_occupied_covid} isAmount />
              )}
            </KpiTile>
          </TwoKpiSection>
          <ChartTile
            title={textNl.linechart_titel}
            description={textNl.linechart_description}
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
              values={dataHospitalNice.values}
              timeframe={hospitalAdmissionsOverTimeTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'admissions_on_date_of_admission_moving_average',
                  label: textNl.linechart_legend_titel_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'admissions_on_date_of_admission',
                  label: textNl.linechart_legend_titel,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedRange,
                    end: Infinity,
                    label: textNl.linechart_legend_underreported_titel,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['admissions_on_date_of_admission_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'hospital_nice'),
              }}
            />
          </ChartTile>
          <ChartTile
            title={textNl.chart_bedbezetting.title}
            description={textNl.chart_bedbezetting.description}
            metadata={{
              source: textNl.bronnen.lnaz,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={TimeframeOption.THIRTY_DAYS}
            onSelectTimeframe={setHospitalBedsOccupiedOverTimeTimeframe}
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
                  label: textNl.chart_bedbezetting.legend_trend_label,
                  color: colors.primary,
                },
                {
                  type: 'scatter-plot',
                  metricProperty: 'beds_occupied_covid',
                  label: textNl.chart_bedbezetting.legend_dot_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: dataHospitalLcps.values[0].date_unix,
                    end: new Date('1 June 2020').getTime() / 1000,
                    label: textNl.chart_bedbezetting.legend_inaccurate_label,
                    shortLabel: commonTexts.common.incomplete,
                  },
                ],
              }}
            />
          </ChartTile>

          <ChoroplethTile
            title={textNl.map_titel}
            description={textNl.map_toelichting}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            legend={{
              thresholds: selectedMap === 'gm' ? thresholds.gm.admissions_on_date_of_admission_per_100000 : thresholds.gm.admissions_on_date_of_admission_per_100000,
              title: textShared.chloropleth_legenda.titel,
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
            title={commonTexts.hospital_admissions_per_age_group.chart_title}
            description={commonTexts.hospital_admissions_per_age_group.chart_description}
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
        </TileList>
      </NlLayout>
    </Layout>
  );
}

export default IntakeHospital;
