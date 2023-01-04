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
  differenceValue?: DifferenceInteger;
};

export const HospitalsTile = ({ title, description, source, dateUnix, tilesData }: HospitalsTileProps) => {
  const metadata: MetadataProps = {
    date: dateUnix,
    source: source,
  };

  return (
    <Box marginBottom={space[5]}>
      <KpiTile title={title}>
        <Text>{description}</Text>
        <TwoKpiSection spacing={5}>
          <KpiContent>
            {tilesData.map((tile, index) => (
              <Box key={index} width="100%">
                <BoldText>{tile.title}</BoldText>
                <Box paddingTop={space[3]} paddingBottom={tile.differenceValue ? space[1] : space[3]}>
                  <KpiValue absolute={tile.absoluteValue} difference={tile.differenceValue} isAmount />
                </Box>
                <Markdown content={tile.description} />
              </Box>
            ))}
          </KpiContent>
        </TwoKpiSection>
        <Metadata {...metadata} isTileFooter />
      </KpiTile>
    </Box>
  );
};

export const KpiContent = styled(Box)`
  border: 1px solid ${colors.gray3};
  color: ${colors.black};
  display: flex;
  flex-direction: column;
  gap: ${space[5]};
  justify-content: space-between;
  padding: 24px ${space[3]};

  @media ${theme.mediaQueries.sm} {
    flex-direction: row;
    padding: 24px;
  }
`;
