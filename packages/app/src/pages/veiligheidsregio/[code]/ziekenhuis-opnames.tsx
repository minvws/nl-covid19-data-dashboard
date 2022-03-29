import {
  colors,
  DAY_IN_SECONDS,
  TimeframeOption,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import { Languages } from '~/locale';
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
  selectVrData,
} from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textVr: siteText.pages.hospitalPage.vr,
        textShared: siteText.pages.hospitalPage.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectVrData('hospital_nice'),
  createGetChoroplethData({
    gm: ({ hospital_nice }) => ({ hospital_nice }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
        "parts": ${getPagePartsQuery('hospitalPage')},
        "elements": ${getElementsQuery('vr', ['hospital_nice'], context.locale)}
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
    selectedVrData: data,
    vrName,
    choropleth,
    content,
    lastGenerated,
  } = props;
  const { commonTexts, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  const { textVr, textShared } = pageText;
  const lastValue = data.hospital_nice.last_value;

  const municipalCodes = gmCodesByVrCode[router.query.code as string];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

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
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.description, {
      safetyRegionName: vrName,
      vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.veiligheidsregio_layout.headings.ziekenhuizen}
            title={replaceVariablesInText(textVr.titel, {
              safetyRegion: vrName,
            })}
            icon={<Ziekenhuis />}
            description={textVr.pagina_toelichting}
            metadata={{
              datumsText: textVr.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textVr.bronnen.rivm],
            }}
            referenceLink={textVr.reference.href}
            pageLinks={content.links}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.barscale_titel}
              description={replaceVariablesInText(textVr.extra_uitleg, {
                dateStart: formatDateFromSeconds(sevenDayAverageDates[0]),
                dateEnd: formatDateFromSeconds(sevenDayAverageDates[1]),
              })}
              metadata={{
                date: sevenDayAverageDates,
                source: textVr.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="hospital_moving_avg_per_region"
                absolute={
                  lastValue.admissions_on_date_of_admission_moving_average_rounded
                }
                isMovingAverageDifference
                isAmount
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textVr.bronnen.rivm }}
            title={textVr.linechart_titel}
            description={textVr.linechart_description}
            timeframeOptions={[TimeframeOption.ALL, TimeframeOption.FIVE_WEEKS]}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'hospital_admissions_over_time_chart',
                }}
                values={data.hospital_nice.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty:
                      'admissions_on_date_of_admission_moving_average',
                    label: textVr.linechart_legend_titel_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'admissions_on_date_of_admission',
                    label: textVr.linechart_legend_titel,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedRange,
                      end: Infinity,
                      label: textVr.linechart_legend_underreported_titel,
                      shortLabel: commonTexts.common.incomplete,
                      cutValuesForMetricProperties: [
                        'admissions_on_date_of_admission_moving_average',
                      ],
                    },
                  ],
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'hospital_nice'
                  ),
                }}
              />
            )}
          </ChartTile>

          <ChoroplethTile
            title={replaceVariablesInText(textVr.map_titel, {
              safetyRegion: vrName,
            })}
            description={textVr.map_toelichting}
            legend={{
              thresholds: thresholds.gm.admissions_on_date_of_admission,
              title: textShared.chloropleth_legenda.titel,
            }}
            metadata={{
              date: lastValue.date_unix,
              source: textVr.bronnen.rivm,
            }}
          >
            <DynamicChoropleth
              map="gm"
              accessibility={{
                key: 'hospital_admissions_choropleth',
              }}
              data={choropleth.gm.hospital_nice}
              dataConfig={{
                metricName: 'hospital_nice',
                metricProperty: 'admissions_on_date_of_admission',
              }}
              dataOptions={{
                selectedCode: selectedMunicipalCode,
                getLink: reverseRouter.gm.ziekenhuisopnames,
                tooltipVariables: {
                  patients: commonTexts.choropleth_tooltip.patients,
                },
              }}
            />
          </ChoroplethTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default IntakeHospital;
