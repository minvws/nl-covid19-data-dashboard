import { useRouter } from 'next/router';
import Maatregelen from '~/assets/maatregelen.svg';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiSection } from '~/components-styled/kpi-section';
import { LockdownTable } from '~/components/restrictions/lockdown-table';
import { PortableText } from '~/lib/sanity';
import { TileList } from '~/components-styled/tile-list';
import { Heading } from '~/components-styled/typography';
// import { EscalationLevel } from '~/components/restrictions/type';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { groq } from 'next-sanity';
import { LockdownData, RoadmapData } from '~/types/cms';

import {
  getLastGeneratedDate,
  createGetContent,
  getVrData,
} from '~/static-props/get-data';
import theme from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
// import { useEscalationLevel } from '~/utils/use-escalation-level';

export { getStaticPaths } from '~/static-paths/vr';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData,
  createGetContent<MaatregelenData>(groq`
  {
    'lockdown': *[_type == 'lockdown'][0],
    // We will need the roadmap when lockdown is disabled in the CMS.
    // 'roadmap': *[_type == 'roadmap'][0]
  }`)
);

const text = siteText.veiligheidsregio_maatregelen;
type VRCode = keyof typeof siteText.veiligheidsregio_maatregelen_urls;

const RegionalRestrictions: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content, safetyRegionName } = props;

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

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <TileList>
        <ContentHeader
          category={siteText.veiligheidsregio_layout.headings.algemeen}
          icon={<Maatregelen fill={theme.colors.restrictions} />}
          title={replaceVariablesInText(
            siteText.veiligheidsregio_maatregelen.titel,
            {
              safetyRegionName,
            }
          )}
        />

        {showLockdown && (
          <KpiSection flexDirection="column">
            <>
              <Heading level={3}>{lockdown.message.title}</Heading>
              <PortableText blocks={lockdown.message.description} />
            </>
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
    </>
  );
};

RegionalRestrictions.getLayout = getSafetyRegionLayout();

export default RegionalRestrictions;
