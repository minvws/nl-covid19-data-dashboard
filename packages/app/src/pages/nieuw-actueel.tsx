import { Box, Spacer } from '~/components/base';
import { MaxWidth } from '~/components';
import { Layout } from '~/domain/layout';
import { ArticleList, TopicalSectionHeader } from '~/domain/topical';
import { isPresent } from 'ts-is-present';
import { Search } from '~/domain/topical/components/search';
import { Languages, SiteText } from '~/locale';
import DynamicIcon from '~/components/get-icon-by-name';
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
      <Box>{selectedTopicalData.title}</Box>
      <Box bg="white">
        <MaxWidth id="content">
          <Box
            spacing={{ _: 4, md: 5 }}
            pt={{ _: 3, md: 5 }}
            px={{ _: 3, sm: 4 }}
          >
            <Box py={4}>
              <DynamicIcon iconName="Down" />
            </Box>
            <Box py={4}>
              <Search title={textShared.secties.search.title.nl} />
            </Box>
          </Box>
        </MaxWidth>

        <Spacer mb={5} />

        <Box width="100%" backgroundColor="offWhite" pb={5}>
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
