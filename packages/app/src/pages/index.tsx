import { Box, Spacer } from '~/components/base';
import styled from 'styled-components';
import { css } from '@styled-system/css';
import { MaxWidth } from '~/components';
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
import { colors } from '@corona-dashboard/common';
import { SeverityIndicatorTile } from '~/components/severity-indicator-tile/severity-indicator-tile';
import { replaceVariablesInText, getFilenameToIconName } from '~/utils';
import { SeverityLevel, SeverityLevels } from '~/components/severity-indicator-tile/types';
import { TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH } from '~/components/severity-indicator-tile/constants';
import { TrendIcon } from '~/domain/topical/types';
import { CollapsibleSection } from '~/components/collapsible';
import { Timeline } from '~/components/severity-indicator-tile/components/timeline/timeline';
import { GetStaticPropsContext } from 'next';
import { getTimelineRangeDates } from '~/components/severity-indicator-tile/components/timeline/logic/get-timeline-range-dates';
import { TimelineMarker } from '~/components/time-series-chart/components/timeline';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { ArticleParts, LinkParts, PagePartQueryResult, RichTextParts } from '~/types/cms';
import { TopicalSanityData } from '~/queries/query-types';
import { TopicalIcon } from '@corona-dashboard/common/src/types';
import { SEVERITY_LEVELS_LIST } from '~/components/severity-indicator-tile/constants';
import { RichContent } from '~/components/cms/rich-content';
import { space } from '~/style/theme';
import { TopicalWeeklySummaryTile } from '~/components/weekly-summary/topical-weekly-summary-tile';

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
      parts: PagePartQueryResult<ArticleParts | LinkParts | RichTextParts>;
      topicalStructure: TopicalSanityData;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('topical_page')},
        "topicalStructure": ${getTopicalStructureQuery(locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'topicalPageArticles'),
        topicalStructure: content.topicalStructure,
      },
    };
  }
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated } = props;

  const { topicalStructure } = content;

  const { topicalConfig, measureTheme, thermometer, kpiThemes, weeklySummary } = topicalStructure;

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

  const currentSeverityLevel = thermometer.currentLevel as unknown as SeverityLevels;
  const currentSeverityLevelTexts = thermometer.thermometerLevels.find((thermometerLevel) => thermometerLevel.level === currentSeverityLevel);

  const thermometerEvents = getThermometerEvents(thermometer.timeline.ThermometerTimelineEvents, thermometer.thermometerLevels);

  const { startDate, endDate } = getTimelineRangeDates(thermometerEvents);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg={colors.white}>
        <MaxWidth id="content">
          <Box
            marginBottom={{ _: space[4] }}
            paddingTop={{ _: space[3], md: space[5] }}
            paddingX={{ _: space[3], sm: space[4] }}
            maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}
          >
            <TopicalHeader title={topicalConfig.title} description={topicalConfig.description} />
          </Box>
          <TopicalWeeklySummaryTile title={weeklySummary.title} summaryItems={weeklySummary.items} level={currentSeverityLevel} label={currentSeverityLevelTexts?.label} />
          {currentSeverityLevelTexts && (
            <Box marginY={space[5]} paddingX={{ _: space[3], sm: space[4] }} maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}>
              <TopicalThemeHeader title={thermometer.title} subtitle={thermometer.subTitle} icon={getFilenameToIconName(thermometer.icon) as TopicalIcon} />

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

              <Box marginY={{ _: space[3], md: space[4] }} borderBottom={'1px solid'} borderBottomColor={colors.gray3}>
                <CollapsibleSection summary={thermometer.collapsibleTitle} textColor={colors.black} borderColor={colors.gray3}>
                  <Box marginY={space[3]}>
                    <OrderedList>
                      {SEVERITY_LEVELS_LIST.map((severityLevel, index) => {
                        const indicatorTexts = thermometer.thermometerLevels.find((thermometerLevel) => thermometerLevel.level === severityLevel);
                        return (
                          indicatorTexts && (
                            <IndicatorLevelDescription
                              key={index}
                              level={indicatorTexts.level as SeverityLevel}
                              label={indicatorTexts.label}
                              description={indicatorTexts.description}
                            />
                          )
                        );
                      })}
                    </OrderedList>
                  </Box>
                </CollapsibleSection>
              </Box>
              <RichContent blocks={thermometer.articleReference} />
            </Box>
          )}

          <Box spacing={{ _: 5, md: 6 }} paddingX={{ _: space[3], sm: space[4] }}>
            {kpiThemes.themes.map((theme) => {
              return (
                <Box key={theme.title}>
                  <Box marginBottom={4}>
                    <TopicalThemeHeader title={theme.title} subtitle={theme.subTitle} icon={getFilenameToIconName(theme.themeIcon) as TopicalIcon} />
                  </Box>
                  <Box
                    display="grid"
                    gridTemplateColumns={tileGridTemplate}
                    gridColumnGap={{ _: space[4], md: space[5] }}
                    gridRowGap={{ _: space[4], md: space[5] }}
                    marginBottom={{ _: space[4], sm: space[5] }}
                  >
                    {theme.tiles.map((themeTile) => {
                      return (
                        <TopicalTile
                          trendIcon={themeTile.trendIcon}
                          title={themeTile.title}
                          tileIcon={getFilenameToIconName(themeTile.tileIcon) as TopicalIcon}
                          description={themeTile.description}
                          cta={themeTile.cta}
                          key={themeTile.title}
                          kpiValue={themeTile.kpiValue}
                          sourceLabel={themeTile.sourceLabel}
                        />
                      );
                    })}
                  </Box>
                  {theme.links && (
                    <TopicalLinksList
                      labels={{
                        DESKTOP: theme.linksLabelDesktop,
                        MOBILE: theme.linksLabelMobile,
                      }}
                      links={theme.links}
                    />
                  )}
                </Box>
              );
            })}

            <Box>
              <Box marginBottom={4}>
                <TopicalThemeHeader title={measureTheme.title} subtitle={measureTheme.subTitle} icon={getFilenameToIconName(measureTheme.themeIcon) as TopicalIcon} />
              </Box>
              <Box display="grid" gridTemplateColumns={tileGridTemplate} gridColumnGap={{ _: space[4], md: space[5] }} gridRowGap={{ _: space[4], md: space[5] }} marginBottom={5}>
                {measureTheme.tiles.map((measureTile, index) => {
                  return <TopicalMeasureTile icon={getFilenameToIconName(measureTile.tileIcon) as TopicalIcon} title={measureTile.description} key={index} />;
                })}
              </Box>
            </Box>
          </Box>
        </MaxWidth>

        <Spacer marginBottom={space[5]} />

        <Box width="100%" backgroundColor="gray1" paddingY={space[5]}>
          <Box paddingY={4} paddingX={{ _: space[3], sm: space[4] }}>
            <Search title={textShared.secties.search.title.nl} />
          </Box>
        </Box>

        <Spacer marginBottom={5} />

        <Box width="100%" paddingBottom={5}>
          <MaxWidth spacing={4} paddingTop={{ _: space[3], md: space[5] }} paddingX={{ _: space[3], sm: space[4], md: space[3], lg: space[4] }}>
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
