import {
  colors,
  DAY_IN_SECONDS,
  TimeframeOption,
  TimeframeOptionsList,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { last } from 'lodash';
import { GetStaticPropsContext } from 'next';
import {
  ChartTile,
  DynamicChoropleth,
  TwoKpiSection,
  ChoroplethTile,
  KpiTile,
  KpiValue,
  PageInformationBlock,
  TileList,
  TimeSeriesChart,
} from '~/components';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { Layout, GmLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import {
  ElementsQueryResult,
  getElementsQuery,
  getTimelineEvents,
} from '~/queries/get-elements-query';
import {
  getArticleParts,
  getLinkParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getLokalizeTexts,
  selectGmData,
} from '~/static-props/get-data';
import { filterByRegionMunicipalities } from '~/static-props/utils/filter-by-region-municipalities';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import {
  countTrailingNullValues,
  getBoundaryDateStartUnix,
  replaceVariablesInText,
  useReverseRouter,
} from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useState } from 'react';

const pageMetrics = ['hospital_nice'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textGm: siteText.pages.hospital_page.gm,
  textShared: siteText.pages.hospital_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectGmData('hospital_nice', 'code'),
  createGetChoroplethData({
    gm: ({ hospital_nice_choropleth }, context) => ({
      hospital_nice_choropleth: filterByRegionMunicipalities(
        hospital_nice_choropleth,
        context
      ),
    }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
        "parts": ${getPagePartsQuery('hospital_page')},
        "elements": ${getElementsQuery('gm', ['hospital_nice'], context.locale)}
      }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'hospitalPageArticles'
        ),
        links: getLinkParts(content.parts.pageParts, 'hospitalPageLinks'),
        elements: content.elements,
      },
    };
  }
);

const IntakeHospital = (props: StaticProps<typeof getStaticProps>) => {
  const {
    pageText,
    selectedGmData: data,
    choropleth,
    municipalityName,
    content,
    lastGenerated,
  } = props;

  const [
    hospitalAdmissionsOverTimeTimeframe,
    setHospitalAdmissionsOverTimeTimeframe,
  ] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { commonTexts, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();

  const { textGm, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(
    pageText,
    selectLokalizeTexts
  );

  const lastValue = data.hospital_nice.last_value;
  const lastValueChoropleth =
    last(choropleth.gm.hospital_nice_choropleth) || lastValue;

  const underReportedRange = getBoundaryDateStartUnix(
    data.hospital_nice.values,
    countTrailingNullValues(
      data.hospital_nice.values,
      'admissions_on_date_of_admission_moving_average'
    )
  );

  const sevenDayAverageDates: [number, number] = [
    underReportedRange - WEEK_IN_SECONDS,
    underReportedRange - DAY_IN_SECONDS,
  ];

  const metadata = {
    ...commonTexts.gemeente_index.metadata,
    title: replaceVariablesInText(textGm.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(textGm.metadata.description, {
      municipalityName,
    }),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={data.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={
              commonTexts.sidebar.categories.consequences_for_healthcare.title
            }
            title={replaceVariablesInText(textGm.titel, {
              municipality: municipalityName,
            })}
            icon={<Ziekenhuis />}
            description={textGm.pagina_toelichting}
            metadata={{
              datumsText: textGm.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textGm.bronnen.rivm],
            }}
            referenceLink={textGm.reference.href}
            pageLinks={content.links}
            articles={content.articles}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textGm.barscale_titel}
              description={replaceVariablesInText(textGm.extra_uitleg, {
                dateStart: formatDateFromSeconds(sevenDayAverageDates[0]),
                dateEnd: formatDateFromSeconds(sevenDayAverageDates[1]),
              })}
              metadata={{
                date: sevenDayAverageDates,
                source: textGm.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="admissions_on_date_of_reporting"
                absolute={
                  lastValue.admissions_on_date_of_admission_moving_average_rounded
                }
                isAmount
                isMovingAverageDifference
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={textGm.linechart_titel}
            description={textGm.linechart_description}
            metadata={{ source: textGm.bronnen.rivm }}
            timeframeOptions={TimeframeOptionsList}
            onSelectTimeframe={(timeframe) =>
              setHospitalAdmissionsOverTimeTimeframe(timeframe)
            }
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
                  metricProperty:
                    'admissions_on_date_of_admission_moving_average',
                  label: textGm.linechart_legend_titel_moving_average,
                  color: colors.data.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'admissions_on_date_of_admission',
                  label: textGm.linechart_legend_titel,
                  color: colors.data.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedRange,
                    end: Infinity,
                    label: textGm.linechart_legend_underreported_titel,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: [
                      'admissions_on_date_of_admission_moving_average_rounded',
                    ],
                  },
                ],
                timelineEvents: getTimelineEvents(
                  content.elements.timeSeries,
                  'hospital_nice'
                ),
              }}
            />
          </ChartTile>

          <ChoroplethTile
            title={replaceVariablesInText(textGm.map_titel, {
              municipality: municipalityName,
            })}
            metadata={{
              date: lastValueChoropleth.date_unix,
              source: textGm.bronnen.rivm,
            }}
            description={textGm.map_toelichting}
            legend={{
              title: textShared.chloropleth_legenda.titel,
              thresholds: thresholds.gm.admissions_on_date_of_admission,
              type: 'default',
            }}
          >
            <DynamicChoropleth
              map="gm"
              accessibility={{
                key: 'hospital_admissions_choropleth',
              }}
              data={choropleth.gm.hospital_nice_choropleth}
              dataConfig={{
                metricName: 'hospital_nice_choropleth',
                metricProperty: 'admissions_on_date_of_admission_per_100000',
              }}
              dataOptions={{
                selectedCode: data.code,
                highlightSelection: true,
                getLink: reverseRouter.gm.ziekenhuisopnames,
                tooltipVariables: {
                  patients: commonTexts.choropleth_tooltip.patients,
                },
              }}
            />
          </ChoroplethTile>
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default IntakeHospital;
