import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { KpiSection } from '~/components/kpi-section';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { useIntl } from '~/intl';
// import { useEscalationLevel } from '~/utils/use-escalation-level';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { LockdownData, RoadmapData } from '~/types/cms';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(),
  createGetContent<MaatregelenData>(() => {
    //@TODO We need to switch this from process.env to context as soon as we use i18n routing
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE;
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

  const { showLockdown } = lockdown;

  // const escalationLevelData = useEscalationLevel(data.restrictions.values);

  /**
   * Colors etc are determined by the effective escalation level which is 1, 2, 3 or 4.
   */
  // const effectiveEscalationLevel: EscalationLevel = escalationLevel > 4 ? 4 : (escalationLevel as EscalationLevel);

  const metadata = {
    ...siteText.nationaal_metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock title={siteText.nationaal_maatregelen.titel} />

          {showLockdown && (
            <KpiSection flexDirection="column">
              <Box spacing={3}>
                <Heading level={3}>{lockdown.message.title}</Heading>
                {lockdown.message.description ? (
                  <RichContent blocks={lockdown.message.description} />
                ) : null}
              </Box>
            </KpiSection>
          )}

          {showLockdown && (
            <KpiSection display="flex" flexDirection="column" spacing={3}>
              <Heading level={3}>{lockdown.title}</Heading>
              <LockdownTable data={lockdown} />
            </KpiSection>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default NationalRestrictions;
