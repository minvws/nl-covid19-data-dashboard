import { BarType } from '~/pages/landelijk/vaccinaties';
import { colors, DifferenceInteger } from '@corona-dashboard/common';
import { Metadata, MetadataProps } from '../metadata';
import { KpiTile } from '../kpi-tile';
import { Text } from '../typography';
import { TwoKpiSection } from '../two-kpi-section';
import { Box } from '~/components/base';
import { BoldText } from '~/components/typography';
import { mediaQueries, space } from '~/style/theme';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { Bar } from '~/domain/vaccine/components/bar';
import { parseBirthyearRange } from '~/domain/vaccine/logic/parse-birthyear-range';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

type TileData = {
  title: string;
  description: string;
  differenceValue?: DifferenceInteger;
  value?: number | null;
  birthyear?: string | null;
  bar?: BarType;
};

interface BorderedKpiSectionProps {
  title: string;
  description: string;
  source: {
    text: string;
    href: string;
  };
  dateUnix: number;
  tilesData: [TileData, TileData];
}

export const BorderedKpiSection = ({ title, description, source, dateUnix, tilesData }: BorderedKpiSectionProps) => {
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
            return <MappedContent key={index} tile={tile} />;
          })}
        </KpiContent>
      </TwoKpiSection>
      <Metadata {...metadata} isTileFooter />
    </KpiTile>
  );
};

interface MappedContentProps {
  tile: TileData;
}

const MappedContent = ({ tile }: MappedContentProps) => {
  const { commonTexts, formatPercentage } = useIntl();

  const parsedAgePercentage = tile.value ? `${formatPercentage(tile.value)}%` : '-';

  const parsedBirthyearRange = tile.birthyear ? parseBirthyearRange(tile.birthyear) : null;

  return (
    <Box>
      <BoldText>{tile.title}</BoldText>

      <Box paddingTop={space[3]} paddingBottom={tile.differenceValue ? space[1] : space[3]}>
        <KpiValue
          absolute={tile.differenceValue ? tile.value : null}
          difference={tile.differenceValue || undefined}
          isAmount={!!tile.differenceValue}
          text={tile.value ? parsedAgePercentage : undefined}
          color={tile?.bar?.color}
        />
      </Box>

      {tile.bar && (
        <Box paddingTop={space[2]} paddingBottom={space[3]}>
          <Bar value={tile.bar.value} color={tile.bar.color} height={12} />
        </Box>
      )}

      <Markdown
        content={
          parsedBirthyearRange
            ? replaceVariablesInText(tile.description, {
                birthyear: replaceVariablesInText(commonTexts.common.birthyear_ranges[parsedBirthyearRange.type], parsedBirthyearRange),
              })
            : tile.description
        }
      />
    </Box>
  );
};

const KpiContent = styled(Box)`
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
