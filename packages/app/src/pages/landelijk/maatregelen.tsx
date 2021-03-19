import css from '@styled-system/css';
import { ContentHeader } from '~/components-styled/content-header';
import { Heading } from '~/components-styled/typography';
import { KpiSection } from '~/components-styled/kpi-section';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { Box } from '~/components-styled/base/box';
import { TileList } from '~/components-styled/tile-list';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import {
  getNlData,
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
// import { useEscalationLevel } from '~/utils/use-escalation-level';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { LockdownData, RoadmapData } from '~/types/cms';
import { RichContent } from '~/components-styled/cms/rich-content';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetContent<MaatregelenData>((_context) => {
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

  const { content, lastGenerated, data } = props;
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
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader title={siteText.nationaal_maatregelen.titel} />

          {showLockdown && (
            <KpiSection flexDirection="column">
              <Box
                css={css({
                  'p:last-child': {
                    margin: '0',
                  },
                })}
              >
                <Heading level={3}>{lockdown.message.title}</Heading>
                {lockdown.message.description ? (
                  <RichContent blocks={lockdown.message.description} />
                ) : null}
              </Box>
            </KpiSection>
          )}

          {showLockdown && (
            <KpiSection display="flex" flexDirection="column">
              <Heading level={3}>{lockdown.title}</Heading>
              <LockdownTable data={lockdown} />
            </KpiSection>
          )}
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default NationalRestrictions;
