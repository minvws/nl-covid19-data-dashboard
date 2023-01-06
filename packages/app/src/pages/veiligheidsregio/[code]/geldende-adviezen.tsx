import { useRouter } from 'next/router';
import { TopicalIcon as PageIcon } from '@corona-dashboard/common/src/types';
import { AnchorTile } from '~/components/anchor-tile';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { Header } from '~/components/page-information-block/components/header';
import DynamicIcon from '~/components/get-icon-by-name';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { MeasuresTable } from '~/domain/measures/measures-table';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, selectVrData, getLokalizeTexts } from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getFilenameToIconName } from '~/utils';
import { GeldendeAdviezenData } from '~/domain/measures/types';

const selectLokalizeTexts = (siteText: SiteText) => ({
  textVr: siteText.pages.measures_page.vr,
});

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData(),
  createGetContent<GeldendeAdviezenData>((context) => {
    const { locale } = context;

    return `
    {
      'measures': *[
        _type == 'measures' && !(_id in path("drafts.**"))
      ][0] {
        icon,
        'measuresCollection': measuresCollection[]->{
            'title': title.${locale},
            icon,
            'measuresItems': measuresItems[]->{
              'title': title.${locale},
              icon
            }
          },
        'title':title.${locale},
        'description': description.${locale},
        'collectionTitle': collectionTitle.${locale}
      },
    }`;
  })
);

const RegionalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, vrName, lastGenerated } = props;

  const { commonTexts } = useIntl();
  const { textVr } = useDynamicLokalizeTexts(pageText, selectLokalizeTexts);
  type VRCode = keyof typeof textVr.urls;

  const { measures } = content;

  const router = useRouter();
  const code = router.query.code as unknown as VRCode;

  const regioUrl = textVr.urls[code];

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
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
            <Heading level={3}>{measures.collectionTitle}</Heading>
            <MeasuresTable data={measures} />
          </Box>

          <AnchorTile
            external
            title={textVr.titel_aanvullendemaatregelen}
            href={regioUrl}
            label={replaceVariablesInText(textVr.linktext_regionpage, {
              safetyRegionName: vrName,
            })}
          >
            {textVr.toelichting_aanvullendemaatregelen}
          </AnchorTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default RegionalRestrictions;
