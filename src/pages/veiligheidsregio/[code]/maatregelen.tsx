import { useRouter } from 'next/router';
import Maatregelen from '~/assets/maatregelen.svg';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { Box, Spacer } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiSection } from '~/components-styled/kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { RestrictionsTable } from '~/components/restrictions/restrictions-table';
import { EscalationLevel } from '~/components/restrictions/type';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionPaths,
  getSafetyRegionStaticProps,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import theme from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useEscalationLevel } from '~/utils/use-escalation-level';

const text = siteText.veiligheidsregio_maatregelen;
type VRCode = keyof typeof siteText.veiligheidsregio_maatregelen_urls;
type HeadingKey = keyof typeof siteText.maatregelen.headings;

const RegionalRestrictions: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;

  const router = useRouter();
  const code = (router.query.code as unknown) as VRCode;

  const regioUrl = siteText.veiligheidsregio_maatregelen_urls[code];

  const escalationLevel = useEscalationLevel(data.restrictions.values);

  // Colors etc are determined by the effective escalation level which is 1, 2, 3 or 4.
  // Data is determined by the actual escalation level which can be 1, 2, 3, 4, 401, 402, 41
  const effectiveEscalationLevel: EscalationLevel =
    escalationLevel > 4 ? 4 : (escalationLevel as EscalationLevel);

  const isNationalLevel = data.restrictions.values.every(
    (res) => res.target_region === 'nl'
  );

  const key = isNationalLevel
    ? 'landelijk'
    : (escalationLevel.toString() as HeadingKey);
  const restrictionInfo = siteText.maatregelen.headings[key];

  const validFrom = formatDateFromSeconds(
    data.restrictions.values[0].valid_from_unix
  );

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

      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.maatregelen}
        icon={<Maatregelen fill={theme.colors.restrictions} />}
        title={replaceVariablesInText(
          siteText.veiligheidsregio_maatregelen.titel,
          {
            safetyRegionName,
          }
        )}
      />

      <Spacer mb={3} />

      <KpiSection flexDirection={['column', 'row']}>
        <Box flex={{ lg: '1 1 25%' }}>
          <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
          <Text>
            {replaceVariablesInText(siteText.escalatie_niveau.valid_from, {
              validFrom,
            })}
          </Text>
        </Box>
        <Box flex={{ lg: '1 1 75%' }}>
          <Text m={0}>
            {replaceVariablesInText(
              restrictionInfo.extratoelichting.toelichting,
              { safetyRegionName }
            )}
          </Text>
        </Box>
      </KpiSection>

      <KpiSection display="flex" flexDirection="column">
        <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
        <RestrictionsTable
          data={data.restrictions.values}
          escalationLevel={effectiveEscalationLevel}
        />
      </KpiSection>

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
    </>
  );
};

RegionalRestrictions.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default RegionalRestrictions;
