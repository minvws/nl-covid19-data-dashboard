import { Box, Spacer } from '~/components/base';
import { MaxWidth } from '~/components';
import { Layout } from '~/domain/layout';
import { ArticleList, TopicalSectionHeader } from '~/domain/topical';
import { isPresent } from 'ts-is-present';
import { Search } from '~/domain/topical/components/search';
import { MeasurementTile } from '~/domain/topical/components/measurement-tile';
import { Languages, SiteText } from '~/locale';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getTopicalPageData } from '~/queries/get-topical-page-data';
import {
  getLastGeneratedDate,
  selectNlData,
  getLokalizeTexts,
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
  getTopicalPageData('nl', [
    'intensive_care_nice',
    'hospital_nice',
    'tested_overall',
    'vaccine_administered_total',
    'vaccine_coverage_per_age_group_estimated',
  ]),
  () => {
    const { selectedNlData: data } = selectNlData(
      'intensive_care_nice',
      'intensive_care_lcps',
      'hospital_nice',
      'tested_overall',
      'tested_ggd',
      'hospital_lcps',
      'difference',
      'vaccine_administered_total',
      'vaccine_coverage_per_age_group_estimated',
      'booster_coverage',
      'sewer'
    )();

    return {
      selectedNlData: {
        ...data,
      },
    };
  }
);

const Home = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated } = props;

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
      <Box bg="white">
        <MaxWidth id="content">
          <Box
            spacing={{ _: 4, md: 5 }}
            pt={{ _: 3, md: 5 }}
            px={{ _: 3, sm: 4 }}
          >
            <Box
              // spacing={{ _: 4, md: 5 }}
              py={4}
              display="grid"
              gridTemplateColumns={{
                _: 'repeat(1, 1fr)',
                xs: 'repeat(3, 1fr)',
              }}
              gridColumnGap={{ _: 4, md: 5 }}
              gridRowGap={{ _: 4, md: 5 }}
            >
              <MeasurementTile />
              <MeasurementTile />
              <MeasurementTile />
              <MeasurementTile />
              <MeasurementTile />
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
