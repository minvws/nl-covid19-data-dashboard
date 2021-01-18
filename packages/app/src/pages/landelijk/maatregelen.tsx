import Maatregelen from '~/assets/maatregelen.svg';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiSection } from '~/components-styled/kpi-section';
import { TileList } from '~/components-styled/tile-list';
import { Heading, Text } from '~/components-styled/typography';
// import { RestrictionsTable } from '~/components/restrictions/restrictions-table';
import { RestrictionsTable } from '~/components/restrictions/lockdown-table';

import { EscalationLevel } from '~/components/restrictions/type';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import text from '~/locale';
import {
  getNlData,
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import theme from '~/style/theme';
import { useEscalationLevel } from '~/utils/use-escalation-level';
import { groq } from 'next-sanity';

type MaatregelenData = {
  title: string;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetContent<MaatregelenData>(groq`
  *[_type == 'roadmap'][0]
`)
);

const NationalRestrictions: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, content } = props;
  console.log(content);

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

        <KpiSection flexDirection="column">
          <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
          <Box>
            <Text m={0}>{restrictionInfo.extratoelichting.toelichting}</Text>
          </Box>
        </KpiSection>

        <KpiSection display="flex" flexDirection="column">
          <Heading level={3}>Maatregelen van de lockdown</Heading>
          <RestrictionsTable
            data={content}
            escalationLevel={effectiveEscalationLevel}
          />
        </KpiSection>

        {/* <KpiSection display="flex" flexDirection="column">
          <Heading level={3}>{text.nationaal_maatregelen.tabel_titel}</Heading>
          <RestrictionsTable
            data={data.restrictions.values}
            escalationLevel={effectiveEscalationLevel}
          />
        </KpiSection> */}
      </TileList>
    </>
  );
};

NationalRestrictions.getLayout = getNationalLayout;

export default NationalRestrictions;
