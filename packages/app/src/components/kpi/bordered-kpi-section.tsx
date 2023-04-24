import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { mediaQueries, space } from '~/style/theme';
import { KpiTile } from '../kpi-tile';
import { Metadata, MetadataProps } from '../metadata';
import { TwoKpiSection } from '../two-kpi-section';
import { Text } from '../typography';
import { KpiContent } from './components/kpi-content';
import { BorderedKpiSectionProps } from './types';

export const BorderedKpiSection = ({ title, description, source, dateUnix, tilesData }: BorderedKpiSectionProps) => {
  const metadata: MetadataProps = {
    date: dateUnix,
    source: source,
  };

  return (
    <KpiTile title={title} hasNoPaddingBottom>
      <Text>{description}</Text>
      <TwoKpiSection spacing={5}>
        <KpiContentContainer>
          {tilesData.map((tile, index) => (
            <KpiContent key={index} tile={tile} />
          ))}
        </KpiContentContainer>
      </TwoKpiSection>
      <Metadata {...metadata} isTileFooter />
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
