import { TopicalIcon as PageIcon } from '@corona-dashboard/common/src/types';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { Header } from '~/components/page-information-block/components/header';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { MeasuresTable } from '~/domain/restrictions/measures-table';
import { Languages, SiteText } from '~/locale';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { Measures } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getFilenameToIconName } from '~/utils';
import { useIntl } from '~/intl';
import DynamicIcon from '~/components/get-icon-by-name';

type GeldendeAdviezenData = {
  measures: Measures;
};

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.measures_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  createGetContent<GeldendeAdviezenData>((context) => {
    const { locale } = context;
    return `
    {
      'measures': *[
        _type == 'measures' && !(_id in path("drafts.**"))
      ][0] {
        icon,
        groups,
        'title':title.${locale},
        'description': description.${locale}
      },
    }`;
  })
);

const NationalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated } = props;
  const { metadataTexts } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const { commonTexts } = useIntl();

  const { measures } = content;
  return (
    <Layout {...metadataTexts} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <Box as="header" spacing={4}>
            <Header
              icon={<DynamicIcon name={getFilenameToIconName(measures.icon) as PageIcon} />}
              title={measures.title}
              category={commonTexts.sidebar.categories.actions_to_take.title}
            />
            {measures.description && (
              <Box maxWidth="maxWidthText">
                <RichContent blocks={measures.description} />
              </Box>
            )}
          </Box>
          <Box as="article" spacing={3}>
            <Heading level={3}>{measures.title}</Heading>
            <MeasuresTable data={measures} level={1} />
          </Box>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default NationalRestrictions;
