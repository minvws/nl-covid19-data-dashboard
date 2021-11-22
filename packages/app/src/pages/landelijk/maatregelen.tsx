import { NlRiskLevelValue } from '@corona-dashboard/common';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
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
} from '~/static-props/get-data';
import { LockdownData, RoadmapData } from '~/types/cms';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

// @TODO remove dummy data once data is avaliable
const DUMMY_DATA = {
  risk_level: 2,
  hospital_admissions_on_date_of_admission_moving_average_rounded: 10,
  hospital_admissions_on_date_of_admission_moving_average_rounded_date_start_unix: 1615845391,
  hospital_admissions_on_date_of_admission_moving_average_rounded_date_end_unix: 1635845391,
  intensive_care_admissions_on_date_of_admission_moving_average_rounded: 12,
  intensive_care_admissions_on_date_of_admission_moving_average_rounded_date_start_unix: 1235845391,
  intensive_care_admissions_on_date_of_admission_moving_average_rounded_date_end_unix: 1635845391,
  date_unix: 1625245391,
  valid_from_unix: 1635845391,
  date_of_insertion_unix: 1635845391,
} as NlRiskLevelValue;

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
              <LockdownTable data={lockdown} level={DUMMY_DATA.risk_level} />
            </Box>
          </Tile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default NationalRestrictions;
