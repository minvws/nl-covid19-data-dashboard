import { colors } from '@corona-dashboard/common';
import { IconName as TopicalIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import { GetStaticPropsContext } from 'next';
import { isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH } from '~/components/severity-indicator-tile/constants';
import { TopicalWeeklySummaryTile } from '~/components/weekly-summary/topical-weekly-summary-tile';
import { Layout } from '~/domain/layout';
import { Advice } from '~/domain/topical/components/advice';
import { TopicalArticlesList } from '~/domain/topical/components/topical-article-list';
import { TopicalHeader } from '~/domain/topical/components/topical-header';
import { TopicalTile } from '~/domain/topical/components/topical-kpi-tile/topical-tile';
import { TopicalLinksList } from '~/domain/topical/components/topical-links-list';
import { TopicalSectionHeader } from '~/domain/topical/components/topical-section-header';
import { TopicalThemeHeader } from '~/domain/topical/components/topical-theme-header';
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getTopicalStructureQuery } from '~/queries/get-topical-structure-query';
import { TopicalSanityData } from '~/queries/query-types';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { space } from '~/style/theme';
import { ArticleParts, LinkParts, PagePartQueryResult, RichTextParts } from '~/types/cms';
import { getFilenameToIconName, replaceVariablesInText } from '~/utils';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getThermometerSeverityLevels } from '~/utils/get-thermometer-severity-level';

const selectLokalizeTexts = (siteText: SiteText) => ({
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
        articles: getArticleParts(content.parts.pageParts, 'topicalPageArticles')?.articles,
        topicalStructure: content.topicalStructure,
      },
    };
  }
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated } = props;

  const { topicalStructure } = content;

  const { topicalConfig, thermometer, kpiThemes, weeklySummary, advice } = topicalStructure;

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

  const { currentSeverityLevel, currentSeverityLevelTexts } = getThermometerSeverityLevels(thermometer);

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
            <TopicalHeader title={topicalConfig.title} />
          </Box>
          <TopicalWeeklySummaryTile title={weeklySummary.title} summaryItems={weeklySummary.items} level={currentSeverityLevel} label={currentSeverityLevelTexts?.label} />
          <Box paddingX={{ _: space[3], sm: space[4] }} maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}>
            <TopicalHeader description={topicalConfig.description} />
          </Box>

          <Spacer marginBottom={space[5]} />

          <Box spacing={{ _: 5, md: 6 }} paddingX={{ _: space[3], sm: space[4] }}>
            {kpiThemes.themes.map((theme) => {
              return (
                <Box key={theme.title}>
                  <Box marginBottom={space[4]}>
                    <TopicalThemeHeader title={theme.title} subtitle={theme.subTitle} icon={getFilenameToIconName(theme.themeIcon) as TopicalIcon} />
                  </Box>
                  {theme.tiles && (
                    <Box
                      display="grid"
                      gridTemplateColumns={tileGridTemplate}
                      gridColumnGap={{ _: space[4], md: space[5] }}
                      gridRowGap={{ _: space[4], md: space[5] }}
                      marginBottom={{ _: space[4], sm: space[5] }}
                    >
                      {theme.tiles.map((themeTile) => {
                        const sourceLabel = themeTile.sourceLabel ? replaceVariablesInText(themeTile.sourceLabel, { date: themeTile.tileDate }) : null;
                        return (
                          <TopicalTile
                            hideTrendIcon={themeTile.hideTrendIcon}
                            trendIcon={themeTile.trendIcon}
                            title={themeTile.title}
                            tileIcon={getFilenameToIconName(themeTile.tileIcon) as TopicalIcon}
                            description={themeTile.description}
                            cta={themeTile.cta}
                            key={themeTile.title}
                            kpiValue={themeTile.kpiValue}
                            sourceLabel={sourceLabel}
                          />
                        );
                      })}
                    </Box>
                  )}
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
          </Box>
        </MaxWidth>

        <Spacer marginBottom={{ _: space[5], md: space[6] }} />

        <Advice title={advice.title} description={advice.description} links={advice.links} image={advice.image} />

        <Box width="100%" paddingBottom={space[5]}>
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

export default Home;
