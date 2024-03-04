import { ArticleParts, LinkParts, PagePartQueryResult, RichTextParts } from '~/types/cms';
import { Box } from '~/components/base';
import { ChartTile, InView, PageInformationBlock, TileList, WarningTile } from '~/components';
import { colors } from '@corona-dashboard/common';
import { Coronathermometer } from '@corona-dashboard/icons';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { getThermometerEvents, getThermometerStructureQuery } from '~/queries/get-thermometer-structure-query';
import { getThermometerSeverityLevels } from '~/utils/get-thermometer-severity-level';
import { getTimelineRangeDates } from '~/components/severity-indicator-tile/components/timeline/logic';
import { IndicatorLevelDescription } from '~/domain/topical/components/indicator-level-description';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { SEVERITY_LEVELS_LIST, TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH } from '~/components/severity-indicator-tile/constants';
import { SeverityIndicatorTile } from '~/components/severity-indicator-tile/severity-indicator-tile';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { space } from '~/style/theme';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { ThermometerConfig } from '~/queries/query-types';
import { Timeline } from '~/components/severity-indicator-tile/components/timeline/timeline';
import { TimelineMarker } from '~/components/time-series-chart/components/timeline';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import styled from 'styled-components';

const selectLokalizeTexts = (siteText: SiteText) => ({
  textNl: siteText.pages.corona_thermometer_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts | RichTextParts>;
      thermometerStructure: ThermometerConfig;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('coronathermometer_page')},
        "thermometerStructure": ${getThermometerStructureQuery(locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'coronathermometerPageArticles'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'coronathermometerPageDataExplained'),
        faqs: getFaqParts(content.parts.pageParts, 'coronathermometerPageFAQs'),
        thermometerStructure: content.thermometerStructure,
      },
    };
  }
);

const CoronaThermometer = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated } = props;

  const { thermometerStructure } = content;

  const { textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...textNl.metadata,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const { commonTexts } = useIntl();
  const { formatDateFromSeconds } = useIntl();

  const { currentSeverityLevel, currentSeverityLevelTexts } = getThermometerSeverityLevels(thermometerStructure);

  const thermometerEvents = getThermometerEvents(thermometerStructure.timeline.ThermometerTimelineEvents, thermometerStructure.thermometerLevels);

  const lastThermometerSetDate = formatDateFromSeconds(thermometerEvents.slice(-1)[0].end, 'weekday-long');

  const { startDate, endDate } = getTimelineRangeDates(thermometerEvents);

  const hasActiveWarningTile = !!textNl.pagina.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            title={textNl.pagina.titel}
            description={textNl.pagina.description}
            icon={<Coronathermometer aria-hidden="true" />}
            metadata={{
              datumsText: replaceVariablesInText(textNl.pagina.dates, {
                current_state: currentSeverityLevel,
                end_date: lastThermometerSetDate,
              }),
              dateOrRange: endDate,
              dateOfInsertionUnix: endDate,
              dataSources: [textNl.bronnen.rivm],
              jsonSources: [jsonText.metrics_archived_national_json],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.pagina.belangrijk_bericht} variant="informational"></WarningTile>}

          <ChartTile title={thermometerStructure.title} disableFullscreen>
            {currentSeverityLevelTexts && (
              <Box maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}>
                <SeverityIndicatorTile
                  level={currentSeverityLevel}
                  description={
                    currentSeverityLevelTexts.description &&
                    replaceVariablesInText(currentSeverityLevelTexts.description, {
                      label: currentSeverityLevelTexts.label.toLowerCase(),
                    })
                  }
                  title={thermometerStructure.tileTitle}
                  label={currentSeverityLevelTexts.label}
                  sourceLabel={thermometerStructure.sourceLabel}
                  datesLabel={thermometerStructure.datesLabel}
                  levelDescription={thermometerStructure.levelDescription}
                />
                {thermometerEvents && thermometerEvents.length && (
                  <Timeline
                    startDate={startDate}
                    endDate={endDate}
                    timelineEvents={thermometerEvents}
                    labels={{
                      heading: thermometerStructure.timeline.title,
                      today: thermometerStructure.timeline.todayLabel,
                      tooltipCurrentEstimation: thermometerStructure.timeline.tooltipLabel,
                    }}
                    legendItems={[
                      {
                        label: thermometerStructure.timeline.legendLabel,
                        shape: 'custom',
                        shapeComponent: <TimelineMarker color={colors.gray6} />,
                      },
                    ]}
                  />
                )}
              </Box>
            )}
          </ChartTile>

          <ChartTile title={thermometerStructure.collapsibleTitle} disableFullscreen>
            <OrderedList>
              {SEVERITY_LEVELS_LIST.map((severityLevel, index) => {
                const indicatorTexts = thermometerStructure.thermometerLevels.find((thermometerLevel) => thermometerLevel.level === severityLevel);
                return (
                  indicatorTexts && (
                    <IndicatorLevelDescription key={index} level={indicatorTexts.level as SeverityLevel} label={indicatorTexts.label} description={indicatorTexts.description} />
                  )
                );
              })}
            </OrderedList>
          </ChartTile>

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle}></PageFaqTile>}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle}></PageArticlesTile>
            </InView>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

const OrderedList = styled.ol`
  margin-top: ${space[4]};
  padding: 0;
  list-style-type: none;

  li:last-child div {
    margin: 0;
  }
`;

export default CoronaThermometer;
