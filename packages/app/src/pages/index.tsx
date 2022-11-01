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
import { getTopicalPageData } from '~/queries/get-topical-page-data';
import { getLastGeneratedDate, getLokalizeTexts, selectTopicalData } from '~/static-props/get-data';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { colors } from '@corona-dashboard/common';
import { SeverityIndicatorTile } from '~/components/severity-indicator-tile/severity-indicator-tile';
import { replaceVariablesInText } from '~/utils';
import { SeverityLevel, SeverityLevels } from '~/components/severity-indicator-tile/types';
import { THERMOMETER_ICON_NAME, TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH, SEVERITY_LEVELS_LIST } from '~/components/severity-indicator-tile/constants';
import { TrendIcon } from '~/domain/topical/types';
import { CollapsibleSection } from '~/components/collapsible';

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
  getTopicalPageData('nl', []),
  ({ locale }: { locale: keyof Languages }) => ({
    selectedTopicalData: selectTopicalData(locale),
  })
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated, selectedTopicalData } = props;

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

  const currentSeverityLevel = textNl.thermometer.current_indicator_level as SeverityLevels;
  const currentSeverityLevelTexts = textNl.thermometer.indicator[`level_${currentSeverityLevel}`];

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg={colors.white}>
        <MaxWidth id="content">
          <Box marginBottom={{ _: 4, md: 5 }} pt={{ _: 3, md: 5 }} px={{ _: 3, sm: 4 }} maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}>
            <TopicalHeader title={selectedTopicalData.title} dynamicDescriptions={selectedTopicalData.dynamicDescription} />
          </Box>
          {SEVERITY_LEVELS_LIST.includes(currentSeverityLevel) && (
            <Box my={5} px={{ _: 3, sm: 4 }} maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}>
              <TopicalThemeHeader
                title={textNl.thermometer.title}
                dynamicSubtitle={replaceVariablesInText(textNl.thermometer.description, {
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
                sourceLabel={textNl.thermometer.indicator.source_label}
                datesLabel={textNl.thermometer.indicator.dates_label}
                levelDescription={textNl.thermometer.indicator.level_description}
                trendIcon={textNl.thermometer.indicator.trend_icon as TrendIcon}
              />
              <Box my={{ _: 3, md: 4 }} borderBottom={'1px solid'} borderBottomColor={colors.gray3}>
                <CollapsibleSection summary={textNl.thermometer.collapsible_title} textColor={colors.black} borderColor={colors.gray3}>
                  <Box my={3}>
                    <OrderedList>
                      {Object.values(SeverityLevels).map((severityLevel, index) => {
                        const indicatorTexts = textNl.thermometer.indicator[`level_${severityLevel}`];
                        return (
                          <IndicatorLevelDescription key={index} level={severityLevel as SeverityLevel} label={indicatorTexts.label} description={indicatorTexts.description} />
                        );
                      })}
                    </OrderedList>
                  </Box>
                </CollapsibleSection>
              </Box>
              <Markdown content={textNl.thermometer.article_reference} />
            </Box>
          )}
          <Box spacing={{ _: 5, md: 6 }} px={{ _: 3, sm: 4 }}>
            {selectedTopicalData.themes
              .sort((a, b) => a.index - b.index)
              .map((theme) => {
                return (
                  <Box key={theme.index}>
                    <Box marginBottom={4}>
                      <TopicalThemeHeader title={theme.title} dynamicSubtitle={theme.dynamicSubtitle} icon={theme.icon} />
                    </Box>
                    <Box display="grid" gridTemplateColumns={tileGridTemplate} gridColumnGap={{ _: 4, md: 5 }} gridRowGap={{ _: 4, md: 5 }} marginBottom={{ _: 4, sm: 5 }}>
                      {theme.themeTiles
                        .sort((a, b) => a.index - b.index)
                        .map((themeTile) => {
                          return (
                            <TopicalTile
                              trendIcon={themeTile.trendIcon}
                              title={themeTile.title}
                              tileIcon={themeTile.tileIcon}
                              dynamicDescription={themeTile.dynamicDescription}
                              cta={themeTile.cta}
                              key={themeTile.index}
                              kpiValue={themeTile.kpiValue}
                            />
                          );
                        })}
                    </Box>
                    <TopicalLinksList
                      labels={{
                        DESKTOP: theme.moreLinks.label.DESKTOP,
                        MOBILE: theme.moreLinks.label.MOBILE,
                      }}
                      links={theme.moreLinks.links}
                    />
                  </Box>
                );
              })}

            <Box>
              <Box marginBottom={4}>
                <TopicalThemeHeader
                  title={selectedTopicalData.measures.title}
                  dynamicSubtitle={selectedTopicalData.measures.dynamicSubtitle}
                  icon={selectedTopicalData.measures.icon}
                />
              </Box>
              <Box display="grid" gridTemplateColumns={tileGridTemplate} gridColumnGap={{ _: 4, md: 5 }} gridRowGap={{ _: 4, md: 5 }} marginBottom={5}>
                {selectedTopicalData.measures.measureTiles
                  .sort((a, b) => a.index - b.index)
                  .map((measureTile) => {
                    return <TopicalMeasureTile icon={measureTile.icon} title={measureTile.title} key={measureTile.index} />;
                  })}
              </Box>
            </Box>
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
