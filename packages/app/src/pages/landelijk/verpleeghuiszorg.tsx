import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useState } from 'react';
import { Coronavirus, Location, Verpleeghuis } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { Divider } from '~/components/divider';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { Languages, SiteText } from '~/locale';
import { useIntl } from '~/intl';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['nursing_home'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.nursing_home_page.nl,
  textShared: siteText.pages.nursing_home_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('difference.nursing_home__infected_locations_total', 'difference.nursing_home__newly_infected_people', 'nursing_home'),
  createGetChoroplethData({
    vr: ({ nursing_home }) => ({ nursing_home }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('nursing_home_page')},
      "elements": ${getElementsQuery('nl', ['nursing_home'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'nursingHomePageArticles'),
        elements: content.elements,
      },
    };
  }
);

function NursingHomeCare(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedNlData: data, choropleth, lastGenerated, content } = props;

  const [nursingHomeConfirmedCasesTimeframe, setNursingHomeConfirmedCasesTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [nursingHomeInfectedLocationsTimeframe, setNursingHomeInfectedLocationsTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [nursingHomeDeceasedTimeframe, setNursingHomeDeceasedTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const nursinghomeDataLastValue = data.nursing_home.last_value;
  const underReportedDateStart = getBoundaryDateStartUnix(data.nursing_home.values, 7);

  const { commonTexts, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const { metadataTexts, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const infectedLocationsText = textShared.verpleeghuis_besmette_locaties;
  const positiveTestedPeopleText = textNl.verpleeghuis_positief_geteste_personen;

  const metadata = {
    ...metadataTexts,
    title: infectedLocationsText.metadata.title,
    description: infectedLocationsText.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.consequences_for_healthcare.title}
            screenReaderCategory={commonTexts.sidebar.metrics.nursing_home_care.title}
            title={positiveTestedPeopleText.titel}
            icon={<Verpleeghuis aria-hidden="true" />}
            description={<Markdown content={positiveTestedPeopleText.pagina_toelichting} />}
            metadata={{
              datumsText: positiveTestedPeopleText.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [positiveTestedPeopleText.bronnen.rivm],
            }}
            referenceLink={positiveTestedPeopleText.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={positiveTestedPeopleText.barscale_titel}
              description={positiveTestedPeopleText.extra_uitleg}
              metadata={{
                date: nursinghomeDataLastValue.date_unix,
                source: positiveTestedPeopleText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_people"
                absolute={nursinghomeDataLastValue.newly_infected_people}
                difference={data.difference.nursing_home__newly_infected_people}
                isAmount
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: positiveTestedPeopleText.bronnen.rivm }}
            title={positiveTestedPeopleText.linechart_titel}
            description={positiveTestedPeopleText.linechart_description}
            timeframeOptions={TimeframeOptionsList}
            onSelectTimeframe={setNursingHomeConfirmedCasesTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'nursing_home_confirmed_cases_over_time_chart',
              }}
              values={data.nursing_home.values}
              timeframe={nursingHomeConfirmedCasesTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'newly_infected_people_moving_average',
                  color: colors.primary,
                  label: positiveTestedPeopleText.line_chart_legend_trend_moving_average_label,
                  shortLabel: positiveTestedPeopleText.tooltip_labels.newly_infected_people_moving_average,
                },
                {
                  type: 'bar',
                  metricProperty: 'newly_infected_people',
                  color: colors.primary,
                  label: positiveTestedPeopleText.line_chart_legend_trend_label,
                  shortLabel: positiveTestedPeopleText.tooltip_labels.newly_infected_people,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedDateStart,
                    end: Infinity,
                    label: positiveTestedPeopleText.line_chart_legend_inaccurate_label,
                    shortLabel: positiveTestedPeopleText.tooltip_labels.inaccurate,
                    cutValuesForMetricProperties: ['newly_infected_people_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'nursing_home', 'newly_infected_people'),
              }}
            />
          </ChartTile>

          <Divider />

          <PageInformationBlock
            id="besmette-locaties"
            title={infectedLocationsText.titel}
            icon={<Location />}
            description={infectedLocationsText.pagina_toelichting}
            metadata={{
              datumsText: infectedLocationsText.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix: nursinghomeDataLastValue.date_of_insertion_unix,
              dataSources: [infectedLocationsText.bronnen.rivm],
            }}
            referenceLink={infectedLocationsText.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={infectedLocationsText.kpi_titel}
              metadata={{
                date: nursinghomeDataLastValue.date_unix,
                source: infectedLocationsText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_locations_total"
                absolute={nursinghomeDataLastValue.infected_locations_total}
                percentage={nursinghomeDataLastValue.infected_locations_percentage}
                difference={data.difference.nursing_home__infected_locations_total}
                isAmount
              />
              <Text>{infectedLocationsText.kpi_toelichting}</Text>
            </KpiTile>

            <KpiTile
              title={infectedLocationsText.barscale_titel}
              metadata={{
                date: nursinghomeDataLastValue.date_unix,
                source: infectedLocationsText.bronnen.rivm,
              }}
            >
              <KpiValue data-cy="newly_infected_locations" absolute={nursinghomeDataLastValue.newly_infected_locations} />
              <Text>{infectedLocationsText.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChoroplethTile
            title={infectedLocationsText.map_titel}
            description={infectedLocationsText.map_toelichting}
            metadata={{
              date: nursinghomeDataLastValue.date_unix,
              source: infectedLocationsText.bronnen.rivm,
            }}
            legend={{
              thresholds: thresholds.vr.infected_locations_percentage,
              title: infectedLocationsText.chloropleth_legenda.titel,
            }}
          >
            <DynamicChoropleth
              map="vr"
              accessibility={{
                key: 'nursing_home_infected_people_choropleth',
              }}
              data={choropleth.vr.nursing_home}
              dataConfig={{
                metricName: 'nursing_home',
                metricProperty: 'infected_locations_percentage',
                dataFormatters: {
                  infected_locations_percentage: formatNumber,
                },
              }}
              dataOptions={{
                isPercentage: true,
                getLink: reverseRouter.vr.verpleeghuiszorg,
              }}
            />
          </ChoroplethTile>

          <ChartTile
            metadata={{ source: infectedLocationsText.bronnen.rivm }}
            title={infectedLocationsText.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={infectedLocationsText.linechart_description}
            onSelectTimeframe={setNursingHomeInfectedLocationsTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'nursing_home_infected_locations_over_time_chart',
              }}
              values={data.nursing_home.values}
              timeframe={nursingHomeInfectedLocationsTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'infected_locations_total',
                  label: textShared.verpleeghuis_besmette_locaties.linechart_tooltip_label,
                  color: colors.primary,
                },
              ]}
              forceLegend
            />
          </ChartTile>

          <Divider />

          <PageInformationBlock
            id="sterfte"
            title={textNl.titel}
            icon={<Coronavirus />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix: nursinghomeDataLastValue.date_of_insertion_unix,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={textNl.barscale_titel}
              description={textNl.extra_uitleg}
              metadata={{
                date: nursinghomeDataLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
            >
              <KpiValue data-cy="deceased_daily" absolute={nursinghomeDataLastValue.deceased_daily} />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textNl.bronnen.rivm }}
            title={textNl.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textNl.linechart_description}
            onSelectTimeframe={setNursingHomeDeceasedTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'nursing_home_deceased_over_time_chart',
              }}
              values={data.nursing_home.values}
              timeframe={nursingHomeDeceasedTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'deceased_daily_moving_average',
                  label: textNl.line_chart_legend_trend_moving_average_label,
                  shortLabel: textNl.tooltip_labels.deceased_daily_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'deceased_daily',
                  label: textNl.line_chart_legend_trend_label,
                  shortLabel: textNl.tooltip_labels.deceased_daily,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedDateStart,
                    end: Infinity,
                    label: textNl.line_chart_legend_inaccurate_label,
                    shortLabel: textNl.tooltip_labels.inaccurate,
                    cutValuesForMetricProperties: ['deceased_daily_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'nursing_home', 'deceased_daily'),
              }}
            />
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
}

export default NursingHomeCare;
