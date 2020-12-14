import Maatregelen from '~/assets/maatregelen.svg';
import { Spacer } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiSection } from '~/components-styled/kpi-section';
import { Heading } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { useRestrictionsTable } from '~/components/restrictions/hooks/use-restrictions-table';
import { RestrictionsTable } from '~/components/restrictions/restrictions-table';
import { SEOHead } from '~/components/seoHead';
import text from '~/locale';
import { NationalPageProps } from '~/static-props/nl-data';
import theme from '~/style/theme';
import { useEscalationLevel } from '~/utils/use-escalation-level';
export { getStaticProps } from '~/pages';

const NationalRestrictions: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;

  const restrictionsTable = useRestrictionsTable(data.restrictions.values);
  const escalationLevel = useEscalationLevel(data.restrictions.values);

  // Colors etc are determined by the effective escalation level which is 1, 2, 3 or 4.
  const effectiveEscalationLevel: 1 | 2 | 3 | 4 =
    escalationLevel > 4 ? 4 : (escalationLevel as 1 | 2 | 3 | 4);

  const key = escalationLevel.toString() as keyof typeof text.maatregelen.headings;
  const restrictionInfo = text.maatregelen.headings[key];

  return (
    <>
      <SEOHead
        title={text.nationaal_metadata.title}
        description={text.nationaal_metadata.description}
      />

      <ContentHeader
        category={text.nationaal_layout.headings.maatregelen}
        icon={<Maatregelen fill={theme.colors.restrictions} />}
        title={text.nationaal_maatregelen.titel}
      />

      <Spacer mb={3} />

      <KpiSection display="flex" flexDirection="column">
        <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
        <RestrictionsTable
          data={restrictionsTable}
          escalationLevel={effectiveEscalationLevel}
        />
      </KpiSection>
    </>
  );
};

NationalRestrictions.getLayout = getNationalLayout;

export default NationalRestrictions;
