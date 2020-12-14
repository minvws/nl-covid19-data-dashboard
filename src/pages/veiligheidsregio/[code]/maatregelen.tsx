import { useRouter } from 'next/router';
import Maatregelen from '~/assets/maatregelen.svg';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { Box, Spacer } from '~/components-styled/base';
import { Header } from '~/components-styled/content-header';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { KpiSection } from '~/components-styled/kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { useRestrictionsTable } from '~/components/restrictions/hooks/use-restrictions-table';
import { RestrictionsTable } from '~/components/restrictions/restrictions-table';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionPaths,
  getSafetyRegionStaticProps,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import theme from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useEscalationLevel } from '~/utils/use-escalation-level';

const text = siteText.veiligheidsregio_maatregelen;
type VRCode = keyof typeof siteText.veiligheidsregio_maatregelen_urls;

const RegionalRestrictions: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;

  const router = useRouter();
  const code = (router.query.code as unknown) as VRCode;

  const regioUrl = siteText.veiligheidsregio_maatregelen_urls[code];

  const restrictionsTable = useRestrictionsTable(data.restrictions.values);

  const escalationLevel = useEscalationLevel(data.restrictions.values);

  // Colors etc are determined by the effective escalation level which is 1, 2, 3 or 4.
  const effectiveEscalationLevel: 1 | 2 | 3 | 4 =
    escalationLevel > 4 ? 4 : (escalationLevel as 1 | 2 | 3 | 4);

  const key = escalationLevel.toString() as keyof typeof siteText.maatregelen.headings;
  const restrictionInfo = siteText.maatregelen.headings[key];

  /*const isNationalLevel = data.restrictions.values.every(
    (res) => res.target_region === 'nl'
  );*/

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

      <Header hasIcon={true}>
        <HeadingWithIcon
          icon={<Maatregelen fill={theme.colors.restrictions} />}
          title={replaceVariablesInText(
            siteText.veiligheidsregio_maatregelen.titel,
            {
              safetyRegionName,
            }
          )}
          headingLevel={1}
        />
      </Header>

      <Spacer mb={3} />

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
          escalationLevel={effectiveEscalationLevel}
        />
      </KpiSection>

      <AnchorTile
        external
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
