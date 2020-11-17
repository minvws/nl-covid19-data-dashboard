import Link from 'next/link';
import ExternalLinkIcon from '~/assets/external-link.svg';
import MaatregelenIcon from '~/assets/maatregelen.svg';
import { Box } from '~/components-styled/base';
import { ExternalLink } from '~/components-styled/external-link';
import { KpiSection } from '~/components-styled/kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { EscalationLevelInfoLabel } from '~/components/common/escalation-level';
import { GenericContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { useRestrictionsTable } from '~/components/restrictions/hooks/useRestrictionsTable';
import { RestrictionsTable } from '~/components/restrictions/restrictionsTable';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import theme from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useEscalationColor } from '~/utils/useEscalationColor';
import { useRestrictionLevel } from '~/utils/useRestrictionLevel';

const text = siteText.veiligheidsregio_maatregelen;
type VRCode = keyof typeof siteText.veiligheidsregio_maatregelen_urls;

const RegionalRestrictions: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName, escalationLevel, code } = props;

  const vrcode: VRCode = code as VRCode;

  const regioUrl = siteText.veiligheidsregio_maatregelen_urls[vrcode];

  const restrictionsTable = useRestrictionsTable(data.restrictions.values);

  const restrictionLevel = useRestrictionLevel(data.restrictions.values);

  const key = restrictionLevel.toString() as keyof typeof siteText.maatregelen.headings;
  const restrictionInfo = siteText.maatregelen.headings[key];

  const escalationColor = useEscalationColor(escalationLevel.escalation_level);

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
      <GenericContentHeader
        category={siteText.veiligheidsregio_layout.headings.maatregelen}
        title={replaceVariablesInText(text.titel, {
          safetyRegionName,
        })}
        Icon={MaatregelenIcon}
        iconAttrs={{
          style: {
            color: escalationColor,
          },
        }}
      />
      <KpiSection flexDirection="column">
        <Heading level={3}>{text.titel_risiconiveau}</Heading>
        <Box
          display="flex"
          flexDirection={['column', 'row']}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Box flexShrink={0} display="flex" flexDirection="column" mr={5}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <EscalationLevelInfoLabel
                escalationLevel={escalationLevel.escalation_level}
              />
            </Box>
            <Text>
              {replaceVariablesInText(siteText.escalatie_niveau.valid_from, {
                validFrom: formatDateFromSeconds(
                  escalationLevel.valid_from_unix
                ),
              })}
            </Text>
          </Box>
          <Box display="flex" flexDirection="column">
            <Text m={0}>{restrictionInfo.toelichting_risiconiveau}</Text>
            <Link href="/over-risiconiveaus">
              <a>{text.linktext_riskpage}</a>
            </Link>
          </Box>
        </Box>
      </KpiSection>

      <KpiSection display="flex" flexDirection="column">
        <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
        <Box>
          <Text>
            {replaceVariablesInText(
              restrictionInfo.extratoelichting.toelichting,
              { safetyRegionName }
            )}
          </Text>
        </Box>
        <RestrictionsTable
          data={restrictionsTable}
          escalationLevel={escalationLevel.escalation_level}
        />
      </KpiSection>

      <KpiSection display="flex" flexDirection={['column', 'row']}>
        <Box
          borderRight={{ lg: `1px solid ${theme.colors?.lightGray}` }}
          pr={[0, 2]}
        >
          <Heading level={3}>{text.titel_aanvullendemaatregelen}</Heading>
          <Box>{text.toelichting_aanvullendemaatregelen}</Box>
        </Box>
        <Box ml={[0, 3]} pt={[2, 0]} flexShrink={0} display="flex">
          {regioUrl.length > 0 && (
            <>
              <ExternalLinkIcon />
              <ExternalLink
                pl={1}
                href={regioUrl}
                text={replaceVariablesInText(text.linktext_regionpage, {
                  safetyRegionName,
                })}
              />
            </>
          )}
        </Box>
      </KpiSection>
    </>
  );
};

RegionalRestrictions.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default RegionalRestrictions;
