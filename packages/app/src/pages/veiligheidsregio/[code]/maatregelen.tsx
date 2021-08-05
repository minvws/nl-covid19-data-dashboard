import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { AnchorTile } from '~/components/anchor-tile';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { KpiSection } from '~/components/kpi-section';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { LockdownData, RoadmapData } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/vr';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData(),
  createGetContent<MaatregelenData>((context) => {
    const { locale = 'nl' } = context;

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
  const { selectedVrData: data, content, vrName, lastGenerated } = props;

  const { siteText } = useIntl();
  const text = siteText.veiligheidsregio_maatregelen;
  type VRCode = keyof typeof siteText.veiligheidsregio_maatregelen_urls;

  const { lockdown } = content;
  const { showLockdown } = lockdown;

  const router = useRouter();
  const code = router.query.code as unknown as VRCode;

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
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(text.metadata.title, {
      safetyRegionName: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            title={replaceVariablesInText(
              siteText.veiligheidsregio_maatregelen.titel,
              {
                safetyRegionName: vrName,
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
              safetyRegionName: vrName,
            })}
          >
            {text.toelichting_aanvullendemaatregelen}
          </AnchorTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default RegionalRestrictions;
