import { Languages, SiteText } from '~/locale';
import { css } from '@styled-system/css';
import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { GetStaticPropsContext } from 'next';
import { getTimelineRangeDates } from '~/components/severity-indicator-tile/components/timeline/logic';
import { Timeline } from '~/components/severity-indicator-tile/components/timeline/timeline';
import { SEVERITY_LEVELS_LIST, TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH } from '~/components/severity-indicator-tile/constants';
import { SeverityIndicatorTile } from '~/components/severity-indicator-tile/severity-indicator-tile';
import { SeverityLevel, SeverityLevels } from '~/components/severity-indicator-tile/types';
import { TimelineMarker } from '~/components/time-series-chart/components/timeline';
import { IndicatorLevelDescription } from '~/domain/topical/components/indicator-level-description';
import { TrendIcon } from '~/domain/topical/types';
import { getThermometerEvents, getTopicalStructureQuery } from '~/queries/get-topical-structure-query';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult, RichTextParts } from '~/types/cms';
import { TopicalSanityData } from '~/queries/query-types';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { InView, PageInformationBlock, TileList, WarningTile } from '~/components';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { TopicalThemeHeader } from '~/domain/topical/components/topical-theme-header';
import { space } from '~/style/theme';
import { Coronathermometer } from '@corona-dashboard/icons';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';

const selectLokalizeTexts = (siteText: SiteText) => ({
  textNl: siteText.pages.corona_thermometer_page.nl,
  textShared: siteText.pages.corona_thermometer_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts | RichTextParts>;
      topicalStructure: TopicalSanityData;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('coronathermometer_page')},
        "topicalStructure": ${getTopicalStructureQuery(locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'coronathermometerPageArticles'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'coronathermometerPageDataExplained'),
        faqs: getFaqParts(content.parts.pageParts, 'coronathermometerPageFAQs'),
        topicalStructure: content.topicalStructure,
      },
    };
  }
);

const CoronaThermometer = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated } = props;

  const { topicalStructure } = content;

  const { thermometer } = topicalStructure;

  const { textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...textNl.metadata,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const { commonTexts } = useIntl();

  const currentSeverityLevel = thermometer.currentLevel as unknown as SeverityLevels;
  const currentSeverityLevelTexts = thermometer.thermometerLevels.find((thermometerLevel) => thermometerLevel.level === currentSeverityLevel);

  const thermometerEvents = getThermometerEvents(thermometer.timeline.ThermometerTimelineEvents, thermometer.thermometerLevels);

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
              datumsText: textNl.pagina.dates,
              dateOrRange: endDate,
              dateOfInsertionUnix: lastGenerated as unknown as number,
              dataSources: [textShared.bronnen.rivm],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.pagina.belangrijk_bericht} variant="informational"></WarningTile>}

          {currentSeverityLevelTexts && (
            <Box
              marginY={space[5]}
              paddingX={{ _: space[3], sm: space[4] }}
              maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}
              borderBottom={'1px solid'}
              borderBottomColor={colors.gray3}
            >
              <TopicalThemeHeader title={thermometer.title} subtitle={thermometer.subTitle} />

              <SeverityIndicatorTile
                level={currentSeverityLevel}
                description={
                  currentSeverityLevelTexts.description &&
                  replaceVariablesInText(currentSeverityLevelTexts.description, {
                    label: currentSeverityLevelTexts.label.toLowerCase(),
                  })
                }
                title={thermometer.tileTitle}
                label={currentSeverityLevelTexts.label}
                sourceLabel={thermometer.sourceLabel}
                datesLabel={thermometer.datesLabel}
                levelDescription={thermometer.levelDescription}
                trendIcon={thermometer.trendIcon as TrendIcon}
              />

              {thermometerEvents && thermometerEvents.length && (
                <Timeline
                  startDate={startDate}
                  endDate={endDate}
                  timelineEvents={thermometerEvents}
                  labels={{
                    heading: thermometer.timeline.title,
                    today: thermometer.timeline.todayLabel,
                    tooltipCurrentEstimation: thermometer.timeline.tooltipLabel,
                  }}
                  legendItems={[
                    {
                      label: thermometer.timeline.legendLabel,
                      shape: 'custom',
                      shapeComponent: <TimelineMarker color={colors.gray6} />,
                    },
                  ]}
                />
              )}
            </Box>
          )}

          <Box marginY={space[3]}>
            <OrderedList>
              {SEVERITY_LEVELS_LIST.map((severityLevel, index) => {
                const indicatorTexts = thermometer.thermometerLevels.find((thermometerLevel) => thermometerLevel.level === severityLevel);
                return (
                  indicatorTexts && (
                    <IndicatorLevelDescription key={index} level={indicatorTexts.level as SeverityLevel} label={indicatorTexts.label} description={indicatorTexts.description} />
                  )
                );
              })}
            </OrderedList>
          </Box>

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

const OrderedList = styled.ol(
  css({
    listStyleType: 'none',
    margin: '0',
    padding: '0',
  })
);

export default CoronaThermometer;
