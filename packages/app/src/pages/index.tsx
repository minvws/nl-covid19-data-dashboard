import { Box, Spacer } from '~/components/base';
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
} from '~/domain/topical';
import { isPresent } from 'ts-is-present';
import { Languages, SiteText } from '~/locale';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getTopicalPageData } from '~/queries/get-topical-page-data';
import {
  getLastGeneratedDate,
  getLokalizeTexts,
  selectTopicalData,
} from '~/static-props/get-data';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { colors } from '@corona-dashboard/common';

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
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  getTopicalPageData('nl', []),
  ({ locale }: { locale: keyof Languages }) => ({
    selectedTopicalData: selectTopicalData(locale),
  })
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated, selectedTopicalData } = props;

  const { textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(
    pageText,
    selectLokalizeTexts
  );

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

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box bg={colors.white}>
        <MaxWidth id="content">
          <Box
            marginBottom={{ _: 4, md: 5 }}
            pt={{ _: 3, md: 5 }}
            px={{ _: 3, sm: 4 }}
          >
            <TopicalHeader
              title={selectedTopicalData.title}
              dynamicDescriptions={selectedTopicalData.dynamicDescription}
            />
          </Box>
          <Box spacing={{ _: 5, md: 6 }} px={{ _: 3, sm: 4 }}>
            {selectedTopicalData.themes
              .sort((a, b) => a.index - b.index)
              .map((theme) => {
                return (
                  <Box key={theme.index}>
                    <Box marginBottom={4}>
                      <TopicalThemeHeader
                        title={theme.title}
                        dynamicSubtitle={theme.dynamicSubtitle}
                        icon={theme.icon}
                      />
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns={tileGridTemplate}
                      gridColumnGap={{ _: 4, md: 5 }}
                      gridRowGap={{ _: 4, md: 5 }}
                      marginBottom={{ _: 4, sm: 5 }}
                    >
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
              <Box
                display="grid"
                gridTemplateColumns={tileGridTemplate}
                gridColumnGap={{ _: 4, md: 5 }}
                gridRowGap={{ _: 4, md: 5 }}
                marginBottom={5}
              >
                {selectedTopicalData.measures.measureTiles
                  .sort((a, b) => a.index - b.index)
                  .map((measureTile) => {
                    return (
                      <TopicalMeasureTile
                        icon={measureTile.icon}
                        title={measureTile.title}
                        key={measureTile.index}
                      />
                    );
                  })}
              </Box>
            </Box>
          </Box>
        </MaxWidth>

        <Spacer mb={5} />

        <Box width="100%" backgroundColor="offWhite" py={5}>
          <Box py={4} px={{ _: 3, sm: 4 }}>
            <Search title={textShared.secties.search.title.nl} />
          </Box>
        </Box>

        <Spacer mb={5} />

        <Box width="100%" pb={5}>
          <MaxWidth
            spacing={4}
            pt={{ _: 3, md: 5 }}
            px={{ _: 3, sm: 4, md: 3, lg: 4 }}
          >
            <TopicalSectionHeader
              title={textShared.secties.meer_lezen.titel}
              description={textShared.secties.meer_lezen.omschrijving}
              link={textShared.secties.meer_lezen.link}
              headerVariant="h2"
              text={textShared}
            />

            {isPresent(content.articles) && (
              <TopicalArticlesList
                articles={content.articles}
                text={textShared}
              />
            )}
          </MaxWidth>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
