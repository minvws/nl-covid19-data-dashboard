import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { Metadata, MetadataProps } from '~/components/metadata';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { BoldText, Text } from '~/components/typography';
import styled from 'styled-components';
import { colors, DifferenceInteger } from '@corona-dashboard/common';
import theme, { space } from '~/style/theme';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';

interface HospitalsTileProps {
  title: string;
  description: string;
  source: {
    text: string;
    href: string;
  };
  dateUnix: number;
  tilesData: [TileData, TileData];
}

export type TileData = {
  title: string;
  description: string;
  absoluteValue: number | null;
  differenceValue: DifferenceInteger;
  dataProperty?: string;
};

export const HospitalsTile = ({ title, description, source, dateUnix, tilesData }: HospitalsTileProps) => {
  const metadata: MetadataProps = {
    date: dateUnix,
    source: source,
  };

  return (
    <KpiTile title={title} hasNoPaddingBottom>
      <Text>{description}</Text>
      <TwoKpiSection spacing={5}>
        <KpiContent>
          {tilesData.map((tile, index) => {
            return (
              <Box key={index}>
                <BoldText>{tile.title}</BoldText>
                <Box paddingTop={space[3]} paddingBottom={space[1]}>
                  <KpiValue data-cy={tile.dataProperty} absolute={tile.absoluteValue} difference={tile.differenceValue} isAmount />
                </Box>
                <Markdown content={tile.description} />
              </Box>
            );
          })}
        </KpiContent>
      </TwoKpiSection>
      <Metadata {...metadata} isTileFooter />
    </KpiTile>
  );
};

export const KpiContent = styled(Box)`
  border: 1px solid ${colors.gray3};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${colors.black};
  padding: 24px ${space[3]};
  gap: ${space[5]};

  @media ${theme.mediaQueries.sm} {
    flex-direction: row;
    padding: 24px;
  }
`;
