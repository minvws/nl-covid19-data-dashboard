import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { EscalationLevelType } from '~/domain/escalation-level/common';
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
} from '~/static-props/get-data';
import { LockdownData, RoadmapData } from '~/types/cms';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
  riskLevel: {
    level: EscalationLevelType;
  };
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
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
      'riskLevel': *[_type == 'riskLevelNational']{
		    "level": riskLevel,
      }[0],
      // We will need the roadmap when lockdown is disabled in the CMS.
      // 'roadmap': *[_type == 'roadmap'][0]
    }`;
  })
);

const NationalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();

  const { content, lastGenerated } = props;
  const { lockdown } = content;

  const metadata = {
    ...siteText.nationaal_metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock title={siteText.nationaal_maatregelen.titel} />
          <Tile>
            <Box spacing={3}>
              <Heading level={3}>{lockdown.message.title}</Heading>
              {lockdown.message.description ? (
                <RichContent blocks={lockdown.message.description} />
              ) : null}
            </Box>
          </Tile>

          <Tile>
            <Box spacing={3}>
              <Heading level={3}>{lockdown.title}</Heading>
              <LockdownTable data={lockdown} level={content.riskLevel.level} />
            </Box>
          </Tile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default NationalRestrictions;
