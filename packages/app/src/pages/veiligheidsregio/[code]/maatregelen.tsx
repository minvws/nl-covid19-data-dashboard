import { useRouter } from 'next/router';
import { AnchorTile } from '~/components/anchor-tile';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { useIntl } from '~/intl';
import { Languages } from '~/locale';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
  selectVrData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { LockdownData, RoadmapData } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/vr';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textVr: siteText.pages.measuresPage.vr,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectVrData(),
  selectNlData('risk_level'),
  createGetContent<MaatregelenData>((context) => {
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

const RegionalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, vrName, lastGenerated, selectedNlData } = props;

  const { siteText } = useIntl();
  const { textVr } = pageText;
  type VRCode = keyof typeof textVr.urls;

  const { lockdown } = content;

  const router = useRouter();
  const code = router.query.code as unknown as VRCode;

  const regioUrl = textVr.urls[code];

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
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
            <Heading level={1} as="h2">
              {replaceVariablesInText(textVr.titel, {
                safetyRegionName: vrName,
              })}
            </Heading>
            {lockdown.message.description ? (
              <Box maxWidth="maxWidthText">
                <RichContent blocks={lockdown.message.description} />
              </Box>
            ) : null}
          </Box>

          <Box as="article" spacing={3}>
            <Heading level={3}>{lockdown.title}</Heading>
            <LockdownTable
              data={lockdown}
              level={selectedNlData.risk_level.last_value.risk_level}
            />
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
