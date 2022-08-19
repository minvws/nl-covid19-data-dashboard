import { Box, Spacer } from '~/components/base';
import { MaxWidth } from '~/components';
import { Layout } from '~/domain/layout';
import { ArticleList, TopicalSectionHeader } from '~/domain/topical';
import { isPresent } from 'ts-is-present';
import { Search } from '~/domain/topical/components/search';
import { TopicalTile } from '~/domain/topical/components/topical-tile';
import { TopicalHeader } from '~/domain/topical/components/topical-header';
import { ThemeHeader } from '~/domain/topical/components/theme-header';
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
import { SubjectsList } from '~/domain/topical/components/subjects-list';
import { MeasurementTile } from '~/domain/topical/components/measurement-tile';

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
              dynamicDescription={selectedTopicalData.dynamicDescription}
            />
          </Box>
          <Box spacing={{ _: 4, md: 6 }} px={{ _: 3, sm: 4 }}>
            {selectedTopicalData.themes
              .sort((a, b) => a.index - b.index)
              .map((theme) => {
                return (
                  <Box key={theme.index}>
                    <Box marginBottom={4}>
                      <ThemeHeader
                        title={theme.title}
                        dynamicSubtitle={theme.dynamicSubtitle}
                        icon={theme.icon}
                      />
                    </Box>
                    <Box
                      display="grid"
                      gridTemplateColumns={{
                        _: 'repeat(1, 1fr)',
                        xs: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      }}
                      gridColumnGap={{ _: 4, md: 5 }}
                      gridRowGap={{ _: 4, md: 5 }}
                      marginBottom={5}
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
                    <SubjectsList moreLinks={theme.moreLinks} />
                  </Box>
                );
              })}

            <Box marginBottom={4}>
              <ThemeHeader
                title={selectedTopicalData.measures.title}
                dynamicSubtitle={selectedTopicalData.measures.dynamicSubtitle}
                icon={selectedTopicalData.measures.icon}
              />
            </Box>
            <Box
              py={4}
              display="grid"
              gridTemplateColumns={{
                _: 'repeat(1, 1fr)',
                xs: 'repeat(3, 1fr)',
              }}
              gridColumnGap={{ _: 4, md: 5 }}
              gridRowGap={{ _: 4, md: 5 }}
            >
              {selectedTopicalData.measures.measureTiles
                .sort((a, b) => a.index - b.index)
                .map((measureTile) => {
                  return (
                    <MeasurementTile
                      icon={measureTile.icon}
                      title={measureTile.title}
                      key={measureTile.index}
                    />
                  );
                })}
            </Box>
          </Box>
        </MaxWidth>

        <Spacer mb={5} />

        <Box width="100%" backgroundColor="offWhite" py={5}>
          <Box py={4}>
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
              <ArticleList articles={content.articles} text={textShared} />
            )}
          </MaxWidth>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
