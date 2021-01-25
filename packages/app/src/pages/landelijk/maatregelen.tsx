import css from '@styled-system/css';
import { ContentHeader } from '~/components-styled/content-header';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { Heading } from '~/components-styled/typography';
import { KpiSection } from '~/components-styled/kpi-section';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { PortableText } from '~/lib/sanity';
import { SEOHead } from '~/components-styled/seo-head';
import { Box } from '~/components-styled/base/box';
import { TileList } from '~/components-styled/tile-list';
import Maatregelen from '~/assets/maatregelen.svg';

import text from '~/locale';
import {
  getNlData,
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
// import { useEscalationLevel } from '~/utils/use-escalation-level';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { LockdownData, RoadmapData } from '~/types/cms';
import theme from '~/style/theme';

type MaatregelenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

const query = `
{
  'lockdown': *[_type == 'lockdown'][0],
  // We will need the roadmap when lockdown is disabled in the CMS.
  // 'roadmap': *[_type == 'roadmap'][0]
}`;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetContent<MaatregelenData>(query)
);

const NationalRestrictions: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;
  const { lockdown } = content;

  const { showLockdown } = lockdown;

  // const escalationLevelData = useEscalationLevel(data.restrictions.values);

  /**
   * Colors etc are determined by the effective escalation level which is 1, 2, 3 or 4.
   */
  // const effectiveEscalationLevel: EscalationLevel = escalationLevel > 4 ? 4 : (escalationLevel as EscalationLevel);

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
              <PortableText blocks={lockdown.message.description} />
            </Box>
          </KpiSection>
        )}

        {showLockdown && (
          <KpiSection display="flex" flexDirection="column">
            <Heading level={3}>{lockdown.title}</Heading>
            <LockdownTable data={lockdown} />
          </KpiSection>
        )}
      </TileList>
    </>
  );
};

NationalRestrictions.getLayout = getNationalLayout;

export default NationalRestrictions;
