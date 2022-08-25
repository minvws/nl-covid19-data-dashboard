import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { Languages, SiteText } from '~/locale';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { LockdownData, RoadmapData } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

type GeldendeAdviezenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.measures_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  createGetContent<GeldendeAdviezenData>((context) => {
    const { locale } = context;
    return `
    {
      'lockdown': *[_type == 'lockdown']{
        ...,
        "message": {
          ...message,
          "description": {
            ...message.description,
            "${locale}": [
              ...message.description.${locale}[]
              {
                ...,
                "asset": asset->
              },
            ]
          },
        }
      }[0],
      // We will need the roadmap when lockdown is disabled in the CMS.
      // 'roadmap': *[_type == 'roadmap'][0]
    }`;
  })
);

const NationalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, lastGenerated } = props;
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(
    pageText,
    selectLokalizeTexts
  );

  const { lockdown } = content;

  return (
    <Layout {...metadataTexts} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <Box as="header" spacing={4}>
            <Heading level={1}>{textNl.titel}</Heading>
            {lockdown.message.description ? (
              <Box maxWidth="maxWidthText">
                <RichContent blocks={lockdown.message.description} />
              </Box>
            ) : null}
          </Box>
          <Box as="article" spacing={3}>
            <Heading level={3}>{lockdown.title}</Heading>
            <LockdownTable data={lockdown} level={1} />
          </Box>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default NationalRestrictions;
