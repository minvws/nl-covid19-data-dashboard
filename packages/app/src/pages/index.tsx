import { Box, Spacer } from '~/components/base';
import styled from 'styled-components';
import { css } from '@styled-system/css';
import { Markdown, MaxWidth } from '~/components';
import { Layout } from '~/domain/layout';
import {
  Search,
  TopicalArticlesList,
  TopicalHeader,
  TopicalLinksList,
  TopicalMeasureTile,
  TopicalSectionHeader,
  TopicalThemeHeader,
  TopicalTile,
  IndicatorLevelDescription,
} from '~/domain/topical';
import { isPresent } from 'ts-is-present';
import { Languages, SiteText } from '~/locale';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getTopicalStructureQuery, getThermometerEvents } from '~/queries/get-topical-structure-query';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { colors, MetricName } from '@corona-dashboard/common';
import { SeverityIndicatorTile } from '~/components/severity-indicator-tile/severity-indicator-tile';
import { replaceVariablesInText } from '~/utils';
import { SeverityLevel, SeverityLevels } from '~/components/severity-indicator-tile/types';
import { THERMOMETER_ICON_NAME, TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH, SEVERITY_LEVELS_LIST } from '~/components/severity-indicator-tile/constants';
import { TrendIcon } from '~/domain/topical/types';
import { CollapsibleSection } from '~/components/collapsible';
import { Timeline } from '~/components/severity-indicator-tile/components/timeline/timeline';
import { ElementsQueryResult, getElementsQuery } from '~/queries/get-elements-query';
import { GetStaticPropsContext } from 'next';
import { getTimelineRangeDates } from '~/components/severity-indicator-tile/components/timeline/logic/get-timeline-range-dates';
import { TimelineMarker } from '~/components/time-series-chart/components/timeline';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { ArticleParts, LinkParts, PagePartQueryResult, RichTextParts } from '~/types/cms';
import { TopicalSanityData } from '~/queries/query-types';

const selectLokalizeTexts = (siteText: SiteText) => ({
  hospitalText: siteText.pages.hospital_page.nl,
  intensiveCareText: siteText.pages.intensive_care_page.nl,
  sewerText: siteText.pages.sewer_page.shared,
  positiveTestsText: siteText.pages.positive_tests_page.shared,
  textNl: siteText.pages.topical_page.nl,
  textShared: siteText.pages.topical_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      elements: ElementsQueryResult;
      parts: PagePartQueryResult<ArticleParts | LinkParts | RichTextParts>;
      topicalStructure: TopicalSanityData;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('topical_page')},
        "elements": ${getElementsQuery('nl', ['' as MetricName], locale)}
        "topicalStructure": ${getTopicalStructureQuery(locale)}
      }`;
    })(context);
    return {
      content: {
        elements: content.elements, //Todo check if is removable
        articles: getArticleParts(content.parts.pageParts, 'topicalPageArticles'), //Todo check if is movable to line 62
        topicalStructure: content.topicalStructure,
      },
    };
  }
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated } = props;

  const { topicalStructure } = content;

  const { topicalConfig, measureTheme, thermometer } = topicalStructure;

  const { textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...textNl.nationaal_metadata,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const tileGridTemplate = {
    _: `repeat(1, 1fr)`,
    sm: `repeat(2, 1fr)`,
    md: `repeat(3, 1fr)`,
  };

  const currentSeverityLevel = thermometer.config.currentLevel as unknown as SeverityLevels;
  const currentSeverityLevelTexts = thermometer.config.thermometerLevels.find((thermometerLevel) => thermometerLevel.level === currentSeverityLevel);

  const thermometerEvents = getThermometerEvents(thermometer.timeline.ThermometerEvents);

  const { startDate, endDate } = getTimelineRangeDates(thermometerEvents);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg={colors.white}>
        <MaxWidth id="content">
          <Box marginBottom={{ _: 4, md: 5 }} pt={{ _: 3, md: 5 }} px={{ _: 3, sm: 4 }} maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}>
            <TopicalHeader title={topicalConfig.title} description={topicalConfig.description} />
          </Box>

          {SEVERITY_LEVELS_LIST.includes(currentSeverityLevel) && currentSeverityLevelTexts && (
            <Box my={5} px={{ _: 3, sm: 4 }} maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}>
              <TopicalThemeHeader
                title={thermometer.config.title}
                dynamicSubtitle={replaceVariablesInText(thermometer.config.levelDescription, {
                  level: currentSeverityLevel,
                  label: currentSeverityLevelTexts.label,
                })}
                icon={THERMOMETER_ICON_NAME}
              />

              <SeverityIndicatorTile
                level={currentSeverityLevel}
                description={replaceVariablesInText(currentSeverityLevelTexts.description, {
                  label: currentSeverityLevelTexts.label.toLowerCase(),
                })}
                title={currentSeverityLevelTexts.title}
                label={currentSeverityLevelTexts.label}
                sourceLabel={thermometer.config.sourceLabel}
                datesLabel={thermometer.config.datesLabel}
                levelDescription={thermometer.config.levelDescription}
                trendIcon={thermometer.config.trendIcon as TrendIcon}
              />

              {thermometerEvents && thermometerEvents.length !== 0 && startDate && endDate && (
                <Timeline
                  startDate={startDate}
                  endDate={endDate}
                  timelineEvents={thermometerEvents}
                  labels={{
                    heading: thermometer.config.title,
                    today: thermometer.timeline.legendLabel,
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

              <Box my={{ _: 3, md: 4 }} borderBottom={'1px solid'} borderBottomColor={colors.gray3}>
                <CollapsibleSection summary={thermometer.config.collapsibleTitle} textColor={colors.black} borderColor={colors.gray3}>
                  <Box my={3}>
                    <OrderedList>
                      {Object.values(SeverityLevels).map((severityLevel, index) => {
                        const indicatorTexts = thermometer.config.thermometerLevels.find((thermometerLevel) => thermometerLevel.level === currentSeverityLevel);
                        return (
                          indicatorTexts && (
                            <IndicatorLevelDescription key={index} level={severityLevel as SeverityLevel} label={indicatorTexts.label} description={indicatorTexts.description} />
                          )
                        );
                      })}
                    </OrderedList>
                  </Box>
                </CollapsibleSection>
              </Box>
              <Markdown content={thermometer.config.articleReference} />
            </Box>
          )}

          <Box spacing={{ _: 5, md: 6 }} px={{ _: 3, sm: 4 }}>
            {topicalStructure.topicalConfig.themes.map((theme) => {
              return (
                <Box key={theme.title}>
                  <Box marginBottom={4}>
                    <TopicalThemeHeader title={theme.title} dynamicSubtitle={theme.subTitle} icon={theme.themeIcon} />
                  </Box>
                  <Box display="grid" gridTemplateColumns={tileGridTemplate} gridColumnGap={{ _: 4, md: 5 }} gridRowGap={{ _: 4, md: 5 }} marginBottom={{ _: 4, sm: 5 }}>
                    {theme.tiles.map((themeTile) => {
                      return (
                        <TopicalTile
                          trendIcon={themeTile.trendIcon}
                          title={themeTile.title}
                          tileIcon={themeTile.tileIcon}
                          dynamicDescription={themeTile.description}
                          cta={themeTile.cta}
                          key={themeTile.title}
                          kpiValue={themeTile.kpiValue}
                        />
                      );
                    })}
                  </Box>
                  {/* <TopicalLinksList
                    labels={{
                      DESKTOP: theme.moreLinks.label.DESKTOP,
                      MOBILE: theme.moreLinks.label.MOBILE,
                    }}
                    links={theme.moreLinks.links}
                  /> */}
                </Box>
              );
            })}

            {/* <Box>
              <Box marginBottom={4}>
                <TopicalThemeHeader title={topicalStructure.measures.title} dynamicSubtitle={topicalStructure.measures.dynamicSubtitle} icon={topicalStructure.measures.icon} />
              </Box>
              <Box display="grid" gridTemplateColumns={tileGridTemplate} gridColumnGap={{ _: 4, md: 5 }} gridRowGap={{ _: 4, md: 5 }} marginBottom={5}>
                {topicalStructure.measures.measureTiles
                  .sort((a, b) => a.index - b.index)
                  .map((measureTile) => {
                    return <TopicalMeasureTile icon={measureTile.icon} title={measureTile.title} key={measureTile.index} />;
                  })}
              </Box>
            </Box> */}
          </Box>
        </MaxWidth>

        <Spacer mb={5} />

        <Box width="100%" backgroundColor="gray1" py={5}>
          <Box py={4} px={{ _: 3, sm: 4 }}>
            <Search title={textShared.secties.search.title.nl} />
          </Box>
        </Box>

        <Spacer mb={5} />

        <Box width="100%" pb={5}>
          <MaxWidth spacing={4} pt={{ _: 3, md: 5 }} px={{ _: 3, sm: 4, md: 3, lg: 4 }}>
            <TopicalSectionHeader
              title={textShared.secties.meer_lezen.titel}
              description={textShared.secties.meer_lezen.omschrijving}
              link={textShared.secties.meer_lezen.link}
              headerVariant="h2"
              text={textShared}
            />

            {isPresent(content.articles) && <TopicalArticlesList articles={content.articles} text={textShared} />}
          </MaxWidth>
        </Box>
      </Box>
    </Layout>
  );
};

const OrderedList = styled.ol(
  css({
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  })
);

export default Home;
