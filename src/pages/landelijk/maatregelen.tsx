import Maatregelen from '~/assets/maatregelen.svg';
import { Box, Spacer } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiSection } from '~/components-styled/kpi-section';
import { TileList } from '~/components-styled/tile-list';
import { Heading, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { RestrictionsTable } from '~/components/restrictions/restrictions-table';
import { EscalationLevel } from '~/components/restrictions/type';
import { SEOHead } from '~/components/seoHead';
import text from '~/locale';
import { NationalPageProps } from '~/static-props/nl-data';
import theme from '~/style/theme';
import { useEscalationLevel } from '~/utils/use-escalation-level';
export { getStaticProps } from '~/pages';

const NationalRestrictions: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;

  const escalationLevel = useEscalationLevel(data.restrictions.values);

  // Colors etc are determined by the effective escalation level which is 1, 2, 3 or 4.
  const effectiveEscalationLevel: EscalationLevel =
    escalationLevel > 4 ? 4 : (escalationLevel as EscalationLevel);

  const restrictionInfo = text.maatregelen.headings['landelijk'];

  return (
    <>
      <SEOHead
        title={text.nationaal_metadata.title}
        description={text.nationaal_metadata.description}
      />
      <TileList>
        <ContentHeader
          category={text.nationaal_layout.headings.algemeen}
          icon={<Maatregelen fill={theme.colors.restrictions} />}
          title={text.nationaal_maatregelen.titel}
        />

        <Spacer mb={3} />

        <KpiSection flexDirection="column">
          <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
          <Box>
            <Text m={0}>{restrictionInfo.extratoelichting.toelichting}</Text>
          </Box>
        </KpiSection>

        <KpiSection display="flex" flexDirection="column">
          <Heading level={3}>{text.nationaal_maatregelen.tabel_titel}</Heading>
          <RestrictionsTable
            data={data.restrictions.values}
            escalationLevel={effectiveEscalationLevel}
          />
        </KpiSection>
      </TileList>
    </>
  );
};

NationalRestrictions.getLayout = getNationalLayout;

export default NationalRestrictions;
