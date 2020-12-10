import { useRouter } from 'next/router';
import ExternalLinkIcon from '~/assets/external-link.svg';
import { Box } from '~/components-styled/base';
import { ExternalLink } from '~/components-styled/external-link';
import { KpiSection } from '~/components-styled/kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { useRestrictionsTable } from '~/components/restrictions/hooks/useRestrictionsTable';
import { RestrictionsTable } from '~/components/restrictions/restrictionsTable';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionPaths,
  getSafetyRegionStaticProps,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import theme from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useRestrictionLevel } from '~/utils/useRestrictionLevel';

const text = siteText.veiligheidsregio_maatregelen;
type VRCode = keyof typeof siteText.veiligheidsregio_maatregelen_urls;

const RegionalRestrictions: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;

  const router = useRouter();
  const { code } = router.query;

  const regioUrl =
    siteText.veiligheidsregio_maatregelen_urls[(code as unknown) as VRCode];

  const restrictionsTable = useRestrictionsTable(data.restrictions.values);

  const restrictionLevel = useRestrictionLevel(data.restrictions.values);

  const key = restrictionLevel.toString() as keyof typeof siteText.maatregelen.headings;
  const restrictionInfo = siteText.maatregelen.headings[key];

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
        <RestrictionsTable data={restrictionsTable} escalationLevel={41} />
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
              <ExternalLink href={regioUrl}>
                {replaceVariablesInText(text.linktext_regionpage, {
                  safetyRegionName,
                })}
              </ExternalLink>
            </>
          )}
        </Box>
      </KpiSection>
    </>
  );
};

RegionalRestrictions.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default RegionalRestrictions;
