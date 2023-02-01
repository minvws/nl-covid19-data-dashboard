import { colors, DAY_IN_SECONDS, TimeframeOption, TimeframeOptionsList, WEEK_IN_SECONDS } from '@corona-dashboard/common';
import { useState } from 'react';
import { Ziekenhuis } from '@corona-dashboard/icons';
import { last } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { ChartTile, DynamicChoropleth, ChoroplethTile, KpiTile, KpiValue, PageInformationBlock, TileList, TimeSeriesChart, TwoKpiSection } from '~/components';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { gmCodesByVrCode } from '~/data';
import { Layout, VrLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectVrData } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { countTrailingNullValues, getBoundaryDateStartUnix, replaceVariablesInText, useReverseRouter } from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['hospital_nice'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textVr: siteText.pages.hospital_page.vr,
  textShared: siteText.pages.hospital_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData('hospital_nice'),
  createGetChoroplethData({
    gm: ({ hospital_nice_choropleth }) => ({ hospital_nice_choropleth }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
        "parts": ${getPagePartsQuery('hospital_page')},
        "elements": ${getElementsQuery('vr', ['hospital_nice'], context.locale)}
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
  const { pageText, selectedVrData: data, vrName, choropleth, content, lastGenerated } = props;

  const [hospitalAdmissionsOverTimeTimeframe, setHospitalAdmissionsOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { commonTexts, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  const { textVr, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const lastValue = data.hospital_nice.last_value;

  const lastValueChoropleth = last(choropleth.gm.hospital_nice_choropleth) || lastValue;

  const municipalCodes = gmCodesByVrCode[router.query.code as string];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  const underReportedRange = getBoundaryDateStartUnix(
    data.hospital_nice.values,
    countTrailingNullValues(data.hospital_nice.values, 'admissions_on_date_of_admission_moving_average')
  );

  const sevenDayAverageDates: [number, number] = [underReportedRange - WEEK_IN_SECONDS, underReportedRange - DAY_IN_SECONDS];

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

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.consequences_for_healthcare.title}
            title={replaceVariablesInText(textVr.titel, {
              safetyRegion: vrName,
            })}
            icon={<Ziekenhuis aria-hidden="true" />}
            description={textVr.pagina_toelichting}
            metadata={{
              datumsText: textVr.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
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
                dateStart: formatDateFromSeconds(sevenDayAverageDates[0], 'weekday-long'),
                dateEnd: formatDateFromSeconds(sevenDayAverageDates[1], 'weekday-long'),
              })}
              metadata={{
                date: sevenDayAverageDates,
                source: textVr.bronnen.rivm,
              }}
            >
              <KpiValue data-cy="hospital_moving_avg_per_region" absolute={lastValue.admissions_on_date_of_admission_moving_average_rounded} isMovingAverageDifference isAmount />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textVr.bronnen.rivm }}
            title={textVr.linechart_titel}
            description={textVr.linechart_description}
            timeframeOptions={TimeframeOptionsList}
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
                  label: textVr.linechart_legend_titel_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'admissions_on_date_of_admission',
                  label: textVr.linechart_legend_titel,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedRange,
                    end: Infinity,
                    label: textVr.linechart_legend_underreported_titel,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['admissions_on_date_of_admission_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'hospital_nice'),
              }}
            />
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
              date: lastValueChoropleth.date_unix,
              source: textVr.bronnen.rivm,
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
}

export default IntakeHospital;
