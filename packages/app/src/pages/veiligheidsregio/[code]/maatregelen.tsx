import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiSection } from '~/components-styled/kpi-section';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { TileList } from '~/components-styled/tile-list';
import { Heading } from '~/components-styled/typography';
import { Box } from '~/components-styled/base/box';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { LockdownData, RoadmapData } from '~/types/cms';

import {
  getLastGeneratedDate,
  createGetContent,
  getVrData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RichContent } from '~/components-styled/cms/rich-content';

export { getStaticPaths } from '~/static-paths/vr';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData,
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

const RegionalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { content, safetyRegionName, lastGenerated } = props;

  const { siteText } = useIntl();
  const text = siteText.veiligheidsregio_maatregelen;
  type VRCode = keyof typeof siteText.veiligheidsregio_maatregelen_urls;

  const { lockdown } = content;
  const { showLockdown } = lockdown;

  const router = useRouter();
  const code = (router.query.code as unknown) as VRCode;

  const regioUrl = siteText.veiligheidsregio_maatregelen_urls[code];

  /**
   * We will need this again when lockdown is disabled
   */
  // const escalationLevel = useEscalationLevel(data.restrictions.values);

  // Colors etc are determined by the effective escalation level which is 1, 2, 3 or 4.
  // Data is determined by the actual escalation level which can be 1, 2, 3, 4, 401, 402, 41
  // const effectiveEscalationLevel: EscalationLevel =
  //   escalationLevel > 4 ? 4 : (escalationLevel as EscalationLevel);

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegionName,
    }),
    description: replaceVariablesInText(text.metadata.title, {
      safetyRegionName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            title={replaceVariablesInText(
              siteText.veiligheidsregio_maatregelen.titel,
              {
                safetyRegionName,
              }
            )}
          />

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

          <AnchorTile
            external
            shadow
            title={text.titel_aanvullendemaatregelen}
            href={regioUrl}
            label={replaceVariablesInText(text.linktext_regionpage, {
              safetyRegionName,
            })}
          >
            {text.toelichting_aanvullendemaatregelen}
          </AnchorTile>
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default RegionalRestrictions;
