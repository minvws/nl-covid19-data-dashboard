import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { LockdownData, RoadmapData } from '~/types/cms';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
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

const NationalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();

  const { content, lastGenerated, selectedNlData: data } = props;
  const { lockdown } = content;

  const metadata = {
    ...siteText.pages.topicalPage.nl.nationaal_metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <Box as="header" spacing={4}>
            <Heading level={1} as="h2">
              {siteText.nationaal_maatregelen.titel}
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
              level={data.risk_level.last_value.risk_level}
            />
          </Box>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default NationalRestrictions;
