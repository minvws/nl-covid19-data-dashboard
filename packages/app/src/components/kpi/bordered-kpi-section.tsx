import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { mediaQueries, space } from '~/style/theme';
import { KpiTile } from '../kpi-tile';
import { MetadataProps } from '../metadata';
import { TwoKpiSection } from '../two-kpi-section';
import { KpiContent } from './components/kpi-content';
import { BorderedKpiSectionProps } from './types';
import { Markdown } from '../markdown';

export const BorderedKpiSection = ({ title, description, source, dateOrRange, tilesData }: BorderedKpiSectionProps) => {
  const metadata: MetadataProps = {
    date: dateOrRange,
    source: source,
  };

  return (
    <KpiTile title={title} hasNoPaddingBottom metadata={metadata}>
      <Box maxWidth="maxWidthText">
        <Markdown content={description} />
      </Box>
      <TwoKpiSection spacing={5}>
        <KpiContentContainer>
          {tilesData.map((tile, index) => (
            <KpiContent key={index} {...tile} />
          ))}
        </KpiContentContainer>
      </TwoKpiSection>
    </KpiTile>
  );
};

const KpiContentContainer = styled(Box)`
  border: 1px solid ${colors.gray3};
  display: flex;
  flex-direction: column;
  gap: ${space[5]};
  justify-content: space-between;
  padding: 24px ${space[3]};

  @media ${mediaQueries.sm} {
    flex-direction: row;
    padding: 24px;
  }
`;
